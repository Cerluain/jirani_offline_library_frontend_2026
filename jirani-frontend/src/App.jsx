import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Library from './pages/Library'
import ReadBook from './pages/ReadBook'
import MainDashboard from './pages/MainDashboard'
import Analytics from './pages/Analytics'
import Login from './pages/Login'
import AccountInfo from './pages/AccountInfo'
import Signup from './pages/Signup'
import UploadAndManagement from './pages/UploadAndManagement'
import Video from './pages/Video'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/library" element={<Library />} />
      <Route path="/read/:uid" element={<ReadBook />} />
      <Route path="/maindashboard" element={<MainDashboard />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/login" element={<Login />} />
      <Route path="/AccountInfo" element={<AccountInfo />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/uploadandmanagement" element={<UploadAndManagement />} />
      <Route path="/video" element={<Video />} />
    </Routes>
  )
}

export default App