import express from 'express'
import { body } from 'express-validator'
import {
  addExpense,
  getUserExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseStats,
  getPendingExpenses,
  approveExpense,
  rejectExpense,
  getAllExpenses
} from '../controllers/expenseController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

router.use(protect)

router.post(
  '/',
  [
    body('amount', 'Amount is required and must be a number').isNumeric(),
    body('category', 'Category is required').isIn(['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Other']),
    body('description', 'Description is required').trim().notEmpty(),
    body('date', 'Date must be valid').optional().isISO8601()
  ],
  addExpense
)

router.get('/', getUserExpenses)

router.get('/stats', authorize('admin'), getExpenseStats)

router.get('/:id', getExpenseById)

router.put(
  '/:id',
  [
    body('amount', 'Amount must be a number').optional().isNumeric(),
    body('category', 'Category is invalid').optional().isIn(['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Other']),
    body('description', 'Description is required').optional().trim().notEmpty(),
    body('date', 'Date must be valid').optional().isISO8601()
  ],
  updateExpense
)

router.delete('/:id', deleteExpense)

// Admin routes
router.get('/admin/all', authorize('admin'), getAllExpenses)
router.get('/admin/pending', authorize('admin'), getPendingExpenses)
router.put('/:id/approve', authorize('admin'), approveExpense)
router.put('/:id/reject', authorize('admin'), rejectExpense)

export default router
