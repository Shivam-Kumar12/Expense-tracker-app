import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import { useAuth } from './AuthContext'
import './App.css'
import Login from './components/Login'
import Register from './components/Register'
import ForgotPassword from './components/ForgotPassword'
import Navbar from './components/Navbar'
import Profile from './components/Profile'
import AdminDashboard from './components/AdminDashboard'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import ExpenseStats from './components/ExpenseStats'
import Reports from './components/Reports'
import AboutExpenses from './components/AboutExpenses'
import ApprovedExpenses from './components/ApprovedExpenses'

function App() {
  const { isAuthenticated, loading, user } = useAuth()
  const [expenseToEdit, setExpenseToEdit] = useState(null)

  const ExpensesPage = () => {
    return (
      <>
        <Helmet>
          <title>Expenses - Expense Tracker</title>
          <meta name="description" content="Track and manage your expenses efficiently with our expense tracker application." />
          <meta name="keywords" content="expenses, expense tracking, finance, budget management" />
          <meta property="og:title" content="Expenses - Expense Tracker" />
          <meta property="og:description" content="Track and manage your expenses efficiently with our expense tracker application." />
        </Helmet>
        <div className="app-container">
          <Navbar />
        <main className="app-main">
          <div className="sidebar">
            <ExpenseForm
              onExpenseAdded={() => {
                setExpenseToEdit(null)
                window.location.reload()
              }}
              expenseToEdit={expenseToEdit}
              onEditCancel={() => setExpenseToEdit(null)}
            />
          </div>
          <div className="content">
            <ExpenseList
              onExpenseDeleted={() => window.location.reload()}
              onExpenseEdit={setExpenseToEdit}
            />
          </div>
        </main>
        </div>
      </>
    )
  }

  if (loading) {
    return <div>Loading...</div> // TODO: Add proper loading component
  }

  return (
    <HelmetProvider>
      <Router>
        <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
        <Route path="/forgot-password" element={isAuthenticated ? <Navigate to="/" replace /> : <ForgotPassword />} />
        <Route
          path="/"
          element={isAuthenticated ? <ExpensesPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <><Navbar /><Profile /></> : <Navigate to="/login" replace />}
        />
        <Route
          path="/approved-expenses"
          element={isAuthenticated ? <><Navbar /><ApprovedExpenses /></> : <Navigate to="/login" replace />}
        />
        <Route
          path="/about-expenses"
          element={
            isAuthenticated && user?.role === 'admin' ?
              <><Navbar /><AboutExpenses /></> :
              <Navigate to="/" replace />
          }
        />
        <Route
          path="/reports"
          element={
            isAuthenticated && user?.role === 'admin' ?
              <><Navbar /><Reports /></> :
              <Navigate to="/" replace />
          }
        />
        <Route
          path="/admin"
          element={
            isAuthenticated && user?.role === 'admin' ?
              <><Navbar /><AdminDashboard /></> :
              <Navigate to="/" replace />
          }
        />
      </Routes>
      </Router>
    </HelmetProvider>
  )
}

export default App
