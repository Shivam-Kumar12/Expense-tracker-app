import mongoose from 'mongoose'

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: [true, 'Please provide amount'],
      min: [0, 'Amount must be greater than 0']
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Other']
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: 500
    },
    date: {
      type: Date,
      required: [true, 'Please provide a date'],
      default: Date.now
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'Bank Transfer', 'Other'],
      default: 'Cash'
    },
    tags: [
      {
        type: String
      }
    ],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  { timestamps: true }
)

const Expense = mongoose.model('Expense', expenseSchema)
export default Expense
