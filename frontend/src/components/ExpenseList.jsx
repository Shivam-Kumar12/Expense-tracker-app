import { useState, useEffect } from 'react'
import '../styles/ExpenseList.css'

function ExpenseList({ onExpenseDeleted, onExpenseEdit }) {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/expenses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        const nonApprovedExpenses = data.expenses.filter(expense => expense.status !== 'approved')
        setExpenses(nonApprovedExpenses || [])
      } else {
        setError('Failed to fetch expenses')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setExpenses(expenses.filter(expense => expense._id !== expenseId))
        onExpenseDeleted && onExpenseDeleted()
      } else {
        setError('Failed to delete expense')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
  }

  if (loading) {
    return <div className="loading">Loading expenses...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  if (expenses.length === 0) {
    return <div className="empty-state">No expenses yet. Add one to get started!</div>
  }

  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="expense-list">
      <h2>Expense History</h2>
      <div className="list-container">
        {sortedExpenses.map(expense => (
          <div key={expense._id} className="expense-item">
            <div className="expense-info">
              <div className="expense-header">
                <h3>{expense.description}</h3>
                <div className="expense-meta">
                  <span className="expense-category">{expense.category.substring(0, 3)}</span>
                  <span className={`status-badge ${expense.status || 'pending'}`}>
                    {expense.status ? expense.status.charAt(0).toUpperCase() + expense.status.slice(1) : 'Pending'}
                  </span>
                </div>
              </div>
              <p className="expense-date">{new Date(expense.date).toLocaleDateString()}</p>
            </div>
            <div className="expense-actions">
              <span className="expense-amount">${expense.amount.toFixed(2)}</span>
              <div className="action-buttons">
                {expense.status !== 'rejected' && expense.status !== 'approved' && (
                  <button
                    className="btn-edit"
                    onClick={() => onExpenseEdit && onExpenseEdit(expense)}
                    title="Edit expense"
                  >
                    Edit
                  </button>
                )}
                {expense.status !== 'approved' && (
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(expense._id)}
                    title="Delete expense"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExpenseList
