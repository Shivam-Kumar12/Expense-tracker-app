import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalExpenses: 0,
    totalExpenseAmount: 0,
    recentExpenses: []
  })
  const [allExpenses, setAllExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchAdminStats()
    fetchAllExpenses()
  }, [currentPage, statusFilter])

  const fetchAdminStats = async () => {
    try {
      const token = localStorage.getItem('token')

      // Fetch admin stats (includes users, expenses, and financial data)
      const statsResponse = await fetch('https://backend-cretbql5t-shivam-kumar12s-projects.vercel.app/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats({
          totalUsers: statsData.totalUsers || 0,
          totalExpenses: statsData.totalExpenses || 0,
          totalExpenseAmount: statsData.stats?.totalAmount || 0,
          recentExpenses: [] // We'll get recent expenses from the all expenses endpoint
        })
      } else {
        console.error('Failed to fetch admin stats:', statsResponse.statusText)
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllExpenses = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`https://backend-cretbql5t-shivam-kumar12s-projects.vercel.app/api/expenses/admin/all?page=${currentPage}&limit=10&status=${statusFilter}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAllExpenses(data.expenses || [])
        setTotalPages(data.pages || 1)
      }
    } catch (error) {
      console.error('Error fetching all expenses:', error)
    }
  }

  const handleApproveExpense = async (expenseId) => {
    setActionLoading(expenseId)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`https://backend-cretbql5t-shivam-kumar12s-projects.vercel.app/api/expenses/${expenseId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        // Update the expense status in the list
        setAllExpenses(prev => prev.map(exp =>
          exp._id === expenseId ? { ...exp, status: 'approved' } : exp
        ))
        // Refresh stats
        fetchAdminStats()
      }
    } catch (error) {
      console.error('Error approving expense:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleRejectExpense = async (expenseId) => {
    setActionLoading(expenseId)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`https://backend-cretbql5t-shivam-kumar12s-projects.vercel.app/api/expenses/${expenseId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        // Update the expense status in the list
        setAllExpenses(prev => prev.map(exp =>
          exp._id === expenseId ? { ...exp, status: 'rejected' } : exp
        ))
      }
    } catch (error) {
      console.error('Error rejecting expense:', error)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return <div className="loading">Loading admin dashboard...</div>
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Expense Tracker</title>
        <meta name="description" content="Manage and monitor all expenses in the Expense Tracker admin dashboard." />
        <meta name="keywords" content="admin dashboard, expense tracker, management, finance tracking" />
        <meta property="og:title" content="Admin Dashboard - Expense Tracker" />
        <meta property="og:description" content="Manage and monitor all expenses in the Expense Tracker admin dashboard." />
      </Helmet>
      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.totalUsers}</p>
        </div>

        <div className="stat-card">
          <h3>Total Expenses</h3>
          <p className="stat-number">{stats.totalExpenses}</p>
        </div>

        <div className="stat-card">
          <h3>Total Expense Amount</h3>
          <p className="stat-number">${stats.totalExpenseAmount.toFixed(2)}</p>
        </div>
      </div>

      <div className="all-expenses">
        <div className="expenses-header">
          <h2>All Expense History</h2>
          <div className="filter-controls">
            <select
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

        {allExpenses.length > 0 ? (
          <div className="expenses-list">
            {allExpenses.map((expense) => (
              <div key={expense._id} className={`expense-item ${expense.status}`}>
                <div className="expense-info">
                  <h4>{expense.description}</h4>
                  <p>{expense.category} - ${expense.amount}</p>
                  <small>User: {expense.userId?.name} ({expense.userId?.email})</small>
                  <small>{new Date(expense.date).toLocaleDateString()}</small>
                  <span className={`status-badge ${expense.status}`}>
                    {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                  </span>
                </div>
                <div className="expense-actions">
                  {expense.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApproveExpense(expense._id)}
                        disabled={actionLoading === expense._id}
                        className="approve-btn"
                      >
                        {actionLoading === expense._id ? 'Approving...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleRejectExpense(expense._id)}
                        disabled={actionLoading === expense._id}
                        className="reject-btn"
                      >
                        {actionLoading === expense._id ? 'Rejecting...' : 'Reject'}
                      </button>
                    </>
                  )}
                  {expense.status !== 'pending' && (
                    <span className="status-text">
                      {expense.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No expenses found.</p>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="page-btn"
            >
              Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="page-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <div className="recent-expenses">
        <h2>Recent Expenses</h2>
        {stats.recentExpenses.length > 0 ? (
          <div className="expenses-list">
            {stats.recentExpenses.map((expense) => (
              <div key={expense._id} className="expense-item">
                <div className="expense-info">
                  <h4>{expense.description}</h4>
                  <p>{expense.category} - ${expense.amount}</p>
                  <small>{new Date(expense.date).toLocaleDateString()}</small>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No expenses found.</p>
        )}
      </div>
      </div>
    </>
  )
}

export default AdminDashboard