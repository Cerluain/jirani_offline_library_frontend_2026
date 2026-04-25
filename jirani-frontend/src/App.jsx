import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'

import MainDashboard from './pages/MainDashboard'
import Analytics from './pages/Analytics'
import Login from './pages/Login'
import AccountInfo from './pages/AccountInfo'
import Signup from './pages/Signup'
import UploadAndManagement from './pages/UploadAndManagement'
import Video from "./pages/Video"
import Library from './pages/Library'  
import ReadBook from './pages/ReadBook'

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
    <>
      <Routes>
          <Route path="/" element={<Library />} />
          <Route path="/maindashboard" element={<MainDashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/login" element={<Login />} />
          <Route path="/AccountInfo" element={<AccountInfo />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/read/:uid" element={<ReadBook />} />
          <Route path="/uploadandmanagement" element={<UploadAndManagement />} />
          <Route path="/video" element={<Video/>} />
      </Routes>
    </>
  )
}

export default App

