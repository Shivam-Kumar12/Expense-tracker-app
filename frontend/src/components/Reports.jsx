import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import '../styles/Reports.css'
import '../styles/ExpenseStats.css'

function Reports() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userFilter, setUserFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [users, setUsers] = useState([])
  const [systemStats, setSystemStats] = useState(null)

  useEffect(() => {
    fetchAllExpenses()
    fetchUsers()
    fetchSystemStats()
  }, [])

  const fetchAllExpenses = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('https://backend-cretbql5t-shivam-kumar12s-projects.vercel.app/api/expenses/admin/all', {
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

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('https://backend-cretbql5t-shivam-kumar12s-projects.vercel.app/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchSystemStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('https://backend-cretbql5t-shivam-kumar12s-projects.vercel.app/api/expenses/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSystemStats(data)
      }
    } catch (error) {
      console.error('Error fetching system stats:', error)
    }
  }

  const filteredExpenses = expenses.filter(expense => {
    const userMatch = userFilter === 'all' || expense.userId._id === userFilter
    const statusMatch = statusFilter === 'all' || expense.status === statusFilter
    return userMatch && statusMatch
  })

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

  const getUserName = (userId) => {
    if (typeof userId === 'object' && userId.name) {
      return userId.name
    }
    const user = users.find(u => u.id === userId)
    return user ? user.name : 'Unknown User'
  }

  return (
    <>
      <Helmet>
        <title>Reports - Expense Tracker</title>
        <meta name="description" content="View detailed expense reports and analytics in the Expense Tracker admin dashboard." />
        <meta name="keywords" content="reports, analytics, expense tracker, admin dashboard" />
        <meta property="og:title" content="Reports - Expense Tracker" />
        <meta property="og:description" content="View detailed expense reports and analytics in the Expense Tracker admin dashboard." />
      </Helmet>
      <div className="reports-container">
        <div className="reports-header">
        <h1>Admin Expense Reports</h1>
        <p>View and manage all user expenses</p>
      </div>

      <div className="reports-content">
        <div className="reports-section">
          <h2>Summary Statistics</h2>
          {systemStats ? (
            <div className="stats-container">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-value">{systemStats.totalUsers}</p>
              </div>
              <div className="stat-card">
                <h3>Total Expenses</h3>
                <p className="stat-value">{systemStats.totalExpenses}</p>
              </div>
              <div className="stat-card">
                <h3>Total Amount</h3>
                <p className="stat-value">${systemStats.stats?.totalAmount?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="stat-card">
                <h3>Average Expense</h3>
                <p className="stat-value">${systemStats.stats?.averageExpense?.toFixed(2) || '0.00'}</p>
              </div>
              {systemStats.byCategory && systemStats.byCategory.length > 0 && (
                <div className="stat-card full-width">
                  <h3>By Category</h3>
                  <div className="category-breakdown">
                    {systemStats.byCategory.map((cat) => (
                      <div key={cat._id} className="category-item">
                        <span>{cat._id}</span>
                        <span className="amount">${cat.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {systemStats.topUsers && systemStats.topUsers.length > 0 && (
                <div className="stat-card full-width">
                  <h3>Top Users by Spending</h3>
                  <div className="category-breakdown">
                    {systemStats.topUsers.slice(0, 5).map((user, index) => (
                      <div key={user._id} className="category-item">
                        <span>{index + 1}. {user.user ? user.user[0]?.name : 'Unknown'}</span>
                        <span className="amount">${user.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="loading">Loading statistics...</div>
          )}
        </div>

        <div className="reports-section">
          <h2>All Expenses</h2>

          <div className="filter-section">
            <div className="filter-group">
              <label htmlFor="user-filter">Filter by User:</label>
              <select
                id="user-filter"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="user-filter"
              >
                <option value="all">All Users</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="status-filter">Filter by Status:</label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="status-filter"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading expenses...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : filteredExpenses.length > 0 ? (
            <div className="admin-expenses-list">
              {filteredExpenses.map((expense) => (
                <div key={expense._id} className="admin-expense-item">
                  <div className="expense-details">
                    <h3>{expense.description}</h3>
                    <div className="expense-meta">
                      <span className="expense-user">👤 {getUserName(expense.userId)}</span>
                      <span className="expense-category">{expense.category}</span>
                      <span className="expense-amount">${expense.amount.toFixed(2)}</span>
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
              <p>No expenses match the current filters.</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  )
}

export default Reports