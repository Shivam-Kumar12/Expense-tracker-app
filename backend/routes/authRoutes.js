import express from 'express'
import { body } from 'express-validator'
import multer from 'multer'
import { register, login, getProfile, updateProfile, resetPassword } from '../controllers/userController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// Configure multer for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'profile-' + uniqueSuffix + '.' + file.originalname.split('.').pop())
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  }
})

router.post(
  '/register',
  [
    body('name', 'Name is required').trim().notEmpty(),
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  register
)

router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Password is required').notEmpty()
  ],
  login
)

router.post(
  '/forgot-password',
  [
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  resetPassword
)

router.get('/profile', protect, getProfile)

router.put(
  '/profile',
  protect,
  upload.single('photo'),
  [
    body('name', 'Name must be provided').optional().trim().notEmpty(),
    body('email', 'Please include a valid email').optional().isEmail().normalizeEmail()
  ],
  updateProfile
)

export default router
