import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import Profile from './pages/Profile'
import Analytics from './pages/Analytics'
import Notes from './pages/Notes'

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const pages = {
    dashboard: <Dashboard />,
    jobs: <Jobs />,
    profile: <Profile />,
    analytics: <Analytics />,
    notes: <Notes />,
  }

  return (
    <div className="app-shell">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page)
          setSidebarOpen(false)
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main-content">
        {/* Top bar for mobile */}
        <div className="topbar">
          <button
            className="menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
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