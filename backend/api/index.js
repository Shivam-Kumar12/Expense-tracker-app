import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { errorHandler } from '../middleware/errorHandler.js'
import authRoutes from '../routes/authRoutes.js'
import expenseRoutes from '../routes/expenseRoutes.js'
import adminRoutes from '../routes/adminRoutes.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/uploads', express.static('uploads'))

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB error:', err.message))

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date()
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/expenses', expenseRoutes)
app.use('/api/admin', adminRoutes)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

app.use(errorHandler)

export default app  // ✅ VERY IMPORTANT
