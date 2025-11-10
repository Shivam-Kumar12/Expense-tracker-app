import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import '../styles/AboutExpenses.css'

function AboutExpenses() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/expenses/admin/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setExpenses(data.expenses || [])
      } else {
        setError('Failed to fetch expenses')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredExpenses = expenses.filter(expense => {
    if (statusFilter === 'all') return true
    return expense.status === statusFilter
  })

  if (loading) {
    return <div className="about-expenses-container"><div className="loading">Loading expenses...</div></div>
  }

  if (error) {
    return <div className="about-expenses-container"><div className="error-message">{error}</div></div>
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved': return 'approved'
      case 'rejected': return 'rejected'
      case 'pending': return 'pending'
      default: return 'pending'
    }
  }

  const getStatusText = (status) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending'
  }

  return (
    <>
      <Helmet>
        <title>About Expenses - Expense Tracker</title>
        <meta name="description" content="View and manage all expense submissions in the Expense Tracker admin panel." />
        <meta name="keywords" content="expenses, admin, expense management, finance tracking" />
        <meta property="og:title" content="About Expenses - Expense Tracker" />
        <meta property="og:description" content="View and manage all expense submissions in the Expense Tracker admin panel." />
      </Helmet>
      <div className="about-expenses-container">
        <div className="about-expenses-header">
        <h1>About Expenses</h1>
        <p>View and manage all your expense submissions</p>

        <div className="filter-section">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Expenses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {filteredExpenses.length > 0 ? (
        <div className="about-expenses-list">
          {filteredExpenses.map((expense) => (
            <div key={expense._id} className="about-expense-item">
              <div className="expense-details">
                <h3>{expense.description}</h3>
                <div className="expense-meta">
                  <span className="expense-category">{expense.category}</span>
                  <span className="expense-amount">${expense.amount.toFixed(2)}</span>
                </div>
                <div className="expense-user">
                  <small>User: {expense.userId?.name || 'Unknown'} ({expense.userId?.email || 'N/A'})</small>
                </div>
                <div className="expense-info">
                  <small className="expense-date">
                    {new Date(expense.date).toLocaleDateString()}
                  </small>
                  {expense.paymentMethod && (
                    <small className="expense-payment"> • {expense.paymentMethod}</small>
                  )}
                </div>
                {expense.tags && expense.tags.length > 0 && (
                  <div className="expense-tags">
                    {expense.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="expense-status">
                <span className={`status-badge ${getStatusBadgeClass(expense.status)}`}>
                  {getStatusText(expense.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No expenses found.</p>
          <p>{statusFilter === 'all' ? 'Submit your first expense to get started.' : `No ${statusFilter} expenses found.`}</p>
        </div>
      )}
      </div>
    </>
  )
}

export default AboutExpenses