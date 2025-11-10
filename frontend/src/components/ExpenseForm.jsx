import { useState, useEffect } from 'react'
import '../styles/ExpenseForm.css'

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Other']

function ExpenseForm({ onExpenseAdded, expenseToEdit, onEditCancel }) {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const isEditing = !!expenseToEdit

  // Populate form when editing
  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        amount: expenseToEdit.amount || '',
        category: expenseToEdit.category || 'Food',
        description: expenseToEdit.description || '',
        date: expenseToEdit.date ? new Date(expenseToEdit.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      })
    } else {
      // Reset form when not editing
      setFormData({
        amount: '',
        category: 'Food',
        description: '',
        date: new Date().toISOString().split('T')[0]
      })
    }
  }, [expenseToEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || '' : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.amount || !formData.description) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const url = isEditing
        ? `http://localhost:5000/api/expenses/${expenseToEdit._id}`
        : 'http://localhost:5000/api/expenses'

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: formData.amount,
          category: formData.category,
          description: formData.description,
          date: formData.date
        })
      })

      if (response.ok) {
        const updatedExpense = await response.json()
        onExpenseAdded && onExpenseAdded(updatedExpense)
        if (!isEditing) {
          setFormData({
            amount: '',
            category: 'Food',
            description: '',
            date: new Date().toISOString().split('T')[0]
          })
        }
      } else {
        const errorData = await response.json()
        setError(errorData.message || `Failed to ${isEditing ? 'update' : 'add'} expense`)
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h2>{isEditing ? 'Edit Expense' : 'Add Expense'}</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="amount">Amount ($)</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          min="0"
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          disabled={loading}
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter description"
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Expense' : 'Add Expense')}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={onEditCancel}
            className="btn-cancel"
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default ExpenseForm
