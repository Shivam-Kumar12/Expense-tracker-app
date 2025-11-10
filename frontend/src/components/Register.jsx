import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../AuthContext'
import '../styles/Register.css'

function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError('')

    const result = await register(formData.name, formData.email, formData.password)
    setLoading(false)

    if (result.success) {
      navigate('/login')
    } else {
      setError(result.error)
    }
  }

  return (
    <>
      <Helmet>
        <title>Register - Expense Tracker</title>
        <meta name="description" content="Create a new Expense Tracker account to start managing your finances." />
        <meta name="keywords" content="expense tracker, register, create account, manage expenses" />
        <meta property="og:title" content="Register - Expense Tracker" />
        <meta property="og:description" content="Create a new Expense Tracker account to start managing your finances." />
      </Helmet>
      <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        <div className="auth-links">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
        </form>
      </div>
    </>
  )
}

export default Register