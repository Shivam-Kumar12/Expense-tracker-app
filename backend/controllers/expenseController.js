import Expense from '../models/Expense.js'
import User from '../models/User.js'
import mongoose from 'mongoose'
import { validationResult } from 'express-validator'

export const addExpense = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const { amount, category, description, date, paymentMethod, tags } = req.body

    const expense = await Expense.create({
      userId: req.user.id,
      amount,
      category,
      description,
      date: date || new Date(),
      paymentMethod,
      tags: tags || []
    })

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      expense
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getUserExpenses = async (req, res, next) => {
  try {
    const { category, startDate, endDate, page = 1, limit = 10 } = req.query

    const filter = { userId: req.user.id }

    // Users can see all their expenses (including pending) for management

    if (category && category !== 'all') {
      filter.category = category
    }

    if (startDate || endDate) {
      filter.date = {}
      if (startDate) {
        filter.date.$gte = new Date(startDate)
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate)
      }
    }

    const skip = (page - 1) * limit
    const expenses = await Expense.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Expense.countDocuments(filter)

    res.status(200).json({
      success: true,
      count: expenses.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      expenses
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getExpenseById = async (req, res, next) => {
  try {
    const { id } = req.params

    const expense = await Expense.findById(id)

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      })
    }

    if (expense.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this expense'
      })
    }

    res.status(200).json({
      success: true,
      expense
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params
    const { amount, category, description, date, paymentMethod, tags } = req.body

    let expense = await Expense.findById(id)

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      })
    }

    if (expense.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this expense'
      })
    }

    const updateData = {}
    if (amount !== undefined) updateData.amount = amount
    if (category !== undefined) updateData.category = category
    if (description !== undefined) updateData.description = description
    if (date !== undefined) updateData.date = date
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod
    if (tags !== undefined) updateData.tags = tags

    expense = await Expense.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    })

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      expense
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params

    const expense = await Expense.findById(id)

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      })
    }

    if (expense.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this expense'
      })
    }

    if (expense.status === 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete approved expenses'
      })
    }

    await Expense.findByIdAndDelete(id)

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getExpenseStats = async (req, res, next) => {
  try {
    const stats = await Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: '$amount' },
          averageExpense: { $avg: '$amount' },
          highestExpense: { $max: '$amount' },
          lowestExpense: { $min: '$amount' },
          totalCount: { $sum: 1 }
        }
      }
    ])

    const byCategory = await Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ])

    res.status(200).json({
      success: true,
      stats: stats[0] || {
        totalExpenses: 0,
        averageExpense: 0,
        highestExpense: 0,
        lowestExpense: 0,
        totalCount: 0
      },
      byCategory
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getAllExpenses = async (req, res, next) => {
  try {
    const { userId, category, page = 1, limit = 10 } = req.query

    const filter = {}

    if (userId) {
      filter.userId = userId
    }

    if (category && category !== 'all') {
      filter.category = category
    }

    const skip = (page - 1) * limit
    const expenses = await Expense.find(filter)
      .populate('userId', 'name email')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Expense.countDocuments(filter)

    res.status(200).json({
      success: true,
      count: expenses.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      expenses
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getSystemStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalExpenses = await Expense.countDocuments()

    const stats = await Expense.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          averageExpense: { $avg: '$amount' }
        }
      }
    ])

    const byCategory = await Expense.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ])

    const byUser = await Expense.aggregate([
      {
        $group: {
          _id: '$userId',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $sort: { total: -1 } },
      { $limit: 10 }
    ])

    res.status(200).json({
      success: true,
      totalUsers,
      totalExpenses,
      stats: stats[0] || { totalAmount: 0, averageExpense: 0 },
      byCategory,
      topUsers: byUser
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getPendingExpenses = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const filter = { status: 'pending' }

    const skip = (page - 1) * limit
    const expenses = await Expense.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Expense.countDocuments(filter)

    res.status(200).json({
      success: true,
      count: expenses.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      expenses
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const approveExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true, runValidators: true }
    ).populate('userId', 'name email')

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Expense approved successfully',
      expense
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const rejectExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true, runValidators: true }
    ).populate('userId', 'name email')

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Expense rejected successfully',
      expense
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
