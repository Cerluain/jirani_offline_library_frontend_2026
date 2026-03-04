import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, AuthContext } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

// Pages - Auth
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'

// Pages - Student
import LibraryHome from './pages/student/LibraryHome'
import BookViewerPage from './pages/student/BookViewerPage'
import VideoViewerPage from './pages/student/VideoViewerPage'

// Pages - Teacher
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import MediaManagement from './pages/teacher/MediaManagement'
import UserManagement from './pages/teacher/UserManagement'

// Shared
import AccountInfo from './pages/AccountInfo'

import './index.css'
import './styles/jirani_style.scss'

/**
 * OFFLIB Frontend - Main Application Router
 *
 * Architecture:
 * - AuthContext: Global state for user authentication and role
 * - ProtectedRoute: Guard component for role-based access control
 * - Separate route trees for /auth, /student, /teacher
 *
 * User Stories:
 * 1. Unauthenticated → tries to access protected route → redirected to /auth/login
 * 2. Student → tries to access /teacher/* → redirected to /student/library
 * 3. Teacher → tries to access /student/* → redirected to /teacher/dashboard
 *
 * TODO - Planned Features:
 * - P2/P3 pages: Onboarding, ItemDetailPage, SearchAndFilter, History, Analytics
 * - ThemeContext for dark mode
 * - useAuth, useFetchMedia custom hooks
 * - API integrations: authApi, mediaApi
 */
function AppRoutes() {
  return (
    <Routes>
      {/* === PUBLIC / AUTH ROUTES === */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/signup" element={<SignupPage />} />

      {/* === STUDENT ROUTES === */}
      <Route
        path="/student/library"
        element={<ProtectedRoute component={LibraryHome} requiredRole="student" />}
      />
      <Route
        path="/student/book/:bookId"
        element={<ProtectedRoute component={BookViewerPage} requiredRole="student" />}
      />
      <Route
        path="/student/video"
        element={<ProtectedRoute component={VideoViewerPage} requiredRole="student" />}
      />

      {/* === TEACHER ROUTES === */}
      <Route
        path="/teacher/dashboard"
        element={<ProtectedRoute component={TeacherDashboard} requiredRole="teacher" />}
      />
      <Route
        path="/teacher/media-management"
        element={<ProtectedRoute component={MediaManagement} requiredRole="teacher" />}
      />
      <Route
        path="/teacher/user-management"
        element={<ProtectedRoute component={UserManagement} requiredRole="teacher" />}
      />

      {/* === SHARED ROUTES === */}
      <Route
        path="/account"
        element={<ProtectedRoute component={AccountInfo} />}
      />

      {/* Catch-all: redirect unknown routes to login */}
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  )
}

function App() {
  // Restore auth from localStorage on app load (optional)
  useEffect(() => {
    const stored = localStorage.getItem('auth')
    if (stored) {
      try {
        // Restore auth state if present
        // This is handled by AuthContext, but you can add extra logic here
      } catch (e) {
        console.error('Failed to restore auth state:', e)
      }
    }
  }, [])

  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App

