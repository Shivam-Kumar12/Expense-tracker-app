import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import './Navbar.css'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">💰</span>
        <h2>Expense Tracker</h2>
      </div>

      <div className="navbar-links">
        <Link to="/" className="nav-link">Expenses</Link>
        {user?.role !== 'admin' && (
          <Link to="/approved-expenses" className="nav-link">Approved Expenses</Link>
        )}
        {user?.role === 'admin' && (
          <Link to="/about-expenses" className="nav-link">About Expenses</Link>
        )}
        {user?.role === 'admin' && (
          <Link to="/reports" className="nav-link">Reports</Link>
        )}
        <Link to="/profile" className="nav-link">Profile</Link>
        {user?.role === 'admin' && (
          <Link to="/admin" className="nav-link">Admin Dashboard</Link>
        )}
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar