import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import '../styles/ExpenseList.css'

function ApprovedExpenses() {
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
        const approvedExpenses = data.expenses.filter(expense => expense.status === 'approved')
        setExpenses(approvedExpenses || [])
      } else {
        setError('Failed to fetch expenses')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading approved expenses...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  if (expenses.length === 0) {
    return <div className="empty-state">No approved expenses yet.</div>
  }

  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <>
      <Helmet>
        <title>Approved Expenses - Expense Tracker</title>
        <meta name="description" content="View your approved expenses in the Expense Tracker application." />
        <meta name="keywords" content="approved expenses, expense tracker, finance" />
        <meta property="og:title" content="Approved Expenses - Expense Tracker" />
        <meta property="og:description" content="View your approved expenses in the Expense Tracker application." />
      </Helmet>
      <div className="expense-list">
        <h2>Approved Expenses</h2>
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
                {/* No buttons for approved expenses */}
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </>
  )
}

export default ApprovedExpenses