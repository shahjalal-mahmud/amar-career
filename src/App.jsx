import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import Profile from './pages/Profile'
import Analytics from './pages/Analytics'
import Notes from './pages/Notes'
import Companies from './pages/Companies'

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigate = (page) => {
    setCurrentPage(page)
    setSidebarOpen(false)
  }

  const pages = {
    dashboard: <Dashboard onNavigate={navigate} />,
    jobs:      <Jobs />,
    companies: <Companies />,
    profile:   <Profile />,
    analytics: <Analytics />,
    notes:     <Notes />,
  }

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        currentPage={currentPage}
        onNavigate={navigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main-content">
        <div className="topbar">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <span /><span /><span />
          </button>
          <span className="topbar-title">আমার ক্যারিয়ার</span>
        </div>

        <div className="page-wrapper">
          {pages[currentPage]}
        </div>
      </main>
    </div>
  )
}