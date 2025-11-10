import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import '../styles/ForgotPassword.css'

function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields')
      setSuccess('')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setSuccess('')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('https://backend-cretbql5t-shivam-kumar12s-projects.vercel.app/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message || 'Password updated successfully')
        setFormData({ email: '', password: '', confirmPassword: '' })
      } else if (data?.errors?.length) {
        setError(data.errors[0].msg)
      } else {
        setError(data.message || 'Failed to reset password')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Forgot Password - Expense Tracker</title>
        <meta name="description" content="Reset your Expense Tracker account password." />
        <meta name="keywords" content="expense tracker, reset password" />
        <meta property="og:title" content="Forgot Password - Expense Tracker" />
        <meta property="og:description" content="Reset your Expense Tracker account password." />
      </Helmet>
      <div className="forgot-container">
        <form className="forgot-form" onSubmit={handleSubmit}>
          <h2>Reset Password</h2>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

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
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
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
              placeholder="Confirm new password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>

          <div className="auth-links">
            <p>Remembered your password? <Link to="/login">Back to login</Link></p>
          </div>
        </form>
      </div>
    </>
  )
}

export default ForgotPassword
