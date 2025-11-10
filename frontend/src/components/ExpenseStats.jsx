import { useState, useEffect } from 'react'
import '../styles/ExpenseStats.css'

function ExpenseStats() {
  const [stats, setStats] = useState({
    totalExpense: 0,
    avgExpense: 0,
    highestExpense: 0,
    totalTransactions: 0,
    categoryStats: {}
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/expenses/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        // Transform backend response to match frontend expectations
        const categoryStats = {}
        if (data.byCategory && Array.isArray(data.byCategory)) {
          data.byCategory.forEach(cat => {
            categoryStats[cat._id] = cat.total
          })
        }

        setStats({
          totalExpense: data.stats?.totalExpenses || 0,
          avgExpense: data.stats?.averageExpense || 0,
          highestExpense: data.stats?.highestExpense || 0,
          totalTransactions: data.stats?.totalCount || 0,
          categoryStats: categoryStats
        })
      } else {
        setError('Failed to fetch statistics')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading statistics...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  return (
    <div className="stats-container">
      <div className="stat-card">
        <h3>Total Expenses</h3>
        <p className="stat-value">${stats.totalExpense.toFixed(2)}</p>
      </div>

      <div className="stat-card">
        <h3>Average Expense</h3>
        <p className="stat-value">${stats.avgExpense.toFixed(2)}</p>
      </div>

      <div className="stat-card">
        <h3>Highest Expense</h3>
        <p className="stat-value">${stats.highestExpense.toFixed(2)}</p>
      </div>

      <div className="stat-card">
        <h3>Total Transactions</h3>
        <p className="stat-value">{stats.totalTransactions}</p>
      </div>

      {Object.keys(stats.categoryStats).length > 0 && (
        <div className="stat-card full-width">
          <h3>By Category</h3>
          <div className="category-breakdown">
            {Object.entries(stats.categoryStats).map(([category, amount]) => (
              <div key={category} className="category-item">
                <span>{category}</span>
                <span className="amount">${amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ExpenseStats
