import express from 'express'
import {
  getAllUsers,
  deactivateUser
} from '../controllers/userController.js'
import { getAllExpenses as getExpensesAdmin, getSystemStats as getSystemStatsAdmin } from '../controllers/expenseController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

router.use(protect)
router.use(authorize('admin'))

router.get('/users', getAllUsers)

router.put('/users/:userId/deactivate', deactivateUser)

router.get('/expenses', getExpensesAdmin)

router.get('/stats', getSystemStatsAdmin)

export default router
