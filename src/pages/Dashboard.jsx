const STATS = [
  { label: 'Jobs Saved', value: 0, icon: '📋', color: 'var(--accent)' },
  { label: 'Applied', value: 0, icon: '📤', color: '#60a5fa' },
  { label: 'Interviews', value: 0, icon: '🎯', color: '#34d399' },
  { label: 'Rejected', value: 0, icon: '❌', color: '#f87171' },
]

const STATUS_COLORS = {
  Saved: '#94a3b8',
  Applied: '#60a5fa',
  Shortlisted: '#fbbf24',
  Interview: '#34d399',
  Rejected: '#f87171',
  Accepted: '#a78bfa',
}

export default function Dashboard() {
  return (
    <div className="page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Welcome back</p>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Track your job hunt progress at a glance.</p>
        </div>
        <button className="btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Job
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {STATS.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div className="dashboard-cols">
        {/* Recent Applications */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Applications</h2>
            <button className="card-action">View all →</button>
          </div>
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <p className="empty-title">No applications yet</p>
            <p className="empty-sub">Add your first job to get started.</p>
          </div>
        </div>

        {/* Application Pipeline */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Pipeline Status</h2>
          </div>
          <div className="pipeline">
            {Object.entries(STATUS_COLORS).map(([status, color]) => (
              <div className="pipeline-row" key={status}>
                <span className="pipeline-dot" style={{ background: color }} />
                <span className="pipeline-status">{status}</span>
                <span className="pipeline-bar-wrap">
                  <span className="pipeline-bar" style={{ background: color, width: '0%' }} />
                </span>
                <span className="pipeline-count">0</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Quick Actions</h2>
        </div>
        <div className="quick-actions">
          {[
            { icon: '➕', label: 'Add New Job', sub: 'Save a new opportunity' },
            { icon: '📝', label: 'Write Notes', sub: 'Interview prep & learnings' },
            { icon: '👤', label: 'Update Profile', sub: 'Skills & portfolio links' },
            { icon: '📊', label: 'View Analytics', sub: 'Application statistics' },
          ].map((action) => (
            <button className="quick-action-btn" key={action.label}>
              <span className="qa-icon">{action.icon}</span>
              <span className="qa-label">{action.label}</span>
              <span className="qa-sub">{action.sub}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}