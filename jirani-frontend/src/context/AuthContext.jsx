import { createContext, useState, useCallback } from 'react'

// Create the auth context
export const AuthContext = createContext()

/**
 * AuthProvider wraps the app and manages authentication state
 * Stores: isAuthenticated, user role (student/teacher/admin), and user data
 */
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    role: null, // 'student' | 'teacher' | 'admin'
  })

  /**
   * Login user with email/password and set role
   * TODO: Replace with actual backend API call (authApi.login)
   */
  const login = useCallback((userData, userRole) => {
    setAuth({
      isAuthenticated: true,
      user: userData,
      role: userRole,
    })
    // Persist to localStorage for session continuity
    localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, user: userData, role: userRole }))
  }, [])

  /**
   * Logout user and clear auth state
   */
  const logout = useCallback(() => {
    setAuth({
      isAuthenticated: false,
      user: null,
      role: null,
    })
    localStorage.removeItem('auth')
  }, [])

  const value = {
    ...auth,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
