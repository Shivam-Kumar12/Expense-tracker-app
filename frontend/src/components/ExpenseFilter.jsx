import { useState } from 'react'
import '../styles/ExpenseFilter.css'

const CATEGORIES = ['all', 'Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Other']
const MONTHS = ['all', '2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', 
                 '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12']

function ExpenseFilter({ onFilterChange }) {
  const [category, setCategory] = useState('all')
  const [month, setMonth] = useState('all')

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value
    setCategory(newCategory)
    onFilterChange({ category: newCategory, month })
  }

  const handleMonthChange = (e) => {
    const newMonth = e.target.value
    setMonth(newMonth)
    onFilterChange({ category, month: newMonth })
  }

  return (
    <div className="filter-container">
      <div className="filter-group">
        <label htmlFor="filter-category">Category</label>
        <select
          id="filter-category"
          value={category}
          onChange={handleCategoryChange}
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-month">Month</label>
        <select
          id="filter-month"
          value={month}
          onChange={handleMonthChange}
        >
          {MONTHS.map(m => (
            <option key={m} value={m}>
              {m === 'all' ? 'All Months' : new Date(m).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default ExpenseFilter
