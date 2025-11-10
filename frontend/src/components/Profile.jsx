import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../AuthContext'
import './Profile.css'

const Profile = () => {
  const { user, login, updateUser } = useAuth()
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  })
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')


  useEffect(() => {
    document.title = "Profile - Expense Tracker"
  }, [])

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || ''
      })
      if (user.photo) {
        setPhotoPreview(`http://localhost:5000${user.photo}`)
      }
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedPhoto(file)
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => setPhotoPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setMessage('Authentication required. Please log in again.')
        return
      }

      const formDataToSend = new FormData()

      // Add text fields
      formDataToSend.append('name', profileData.name)
      formDataToSend.append('email', profileData.email)

      // Add photo if selected
      if (selectedPhoto) {
        formDataToSend.append('photo', selectedPhoto)
        console.log('Photo selected:', selectedPhoto.name, 'Size:', selectedPhoto.size)
      } else {
        console.log('No photo selected')
      }

      console.log('Sending profile update request...')
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      })

      console.log('Response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('Profile update successful:', data)
        setMessage('Profile updated successfully!')
        setIsEditing(false)
        setSelectedPhoto(null)
        setPhotoPreview(data.user?.photo ? `http://localhost:5000${data.user.photo}` : null)
        if (data.user) {
          updateUser(data.user)
        }
      } else {
        const error = await response.json()
        console.error('Profile update failed:', error)
        setMessage(error.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Network error:', error)
      setMessage('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>My Profile - Expense Tracker</title>
        <meta name="description" content="Manage your Expense Tracker profile and personal information." />
        <meta name="keywords" content="profile, expense tracker, user settings" />
        <meta property="og:title" content="My Profile - Expense Tracker" />
        <meta property="og:description" content="Manage your Expense Tracker profile and personal information." />
      </Helmet>
      <div className="profile-container">
        <div className="profile-card">
        <h1>User Profile</h1>

        {message && (
          <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="profile-photo-section">
          <div className="photo-display">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="profile-photo" />
            ) : (
              <div className="photo-placeholder">
                <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
              </div>
            )}
          </div>
          {isEditing && (
            <div className="photo-upload">
              <div className="photo-options">
                <label htmlFor="photo-file" className="photo-upload-label">
                  📁 Upload Photo
                </label>
                <input
                  type="file"
                  id="photo-file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="photo-camera" className="photo-upload-label camera-label">
                  📷 Take Photo
                </label>
                <input
                  type="file"
                  id="photo-camera"
                  accept="image/*"
                  capture
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="profile-info">
          <div className="info-item">
            <label>Role:</label>
            <span className="role-badge">{user?.role || 'user'}</span>
          </div>

          <div className="info-item">
            <label>Account Status:</label>
            <span className="status-badge active">Active</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          {console.log('Rendering form, isEditing:', isEditing)}
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="form-actions">
            {!isEditing ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('Edit Profile clicked, setting isEditing to true')
                  setIsEditing(true)
                }}
                className="edit-btn"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  disabled={loading}
                  className="save-btn"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    setProfileData({
                      name: user?.name || '',
                      email: user?.email || ''
                    })
                    setMessage('')
                  }}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
        </div>
      </div>
    </>
  )
}

export default Profile