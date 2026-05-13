const STATUS_TABS = ['All', 'Saved', 'Applied', 'Shortlisted', 'Interview', 'Rejected', 'Accepted']

const STATUS_COLORS = {
  Saved: '#94a3b8',
  Applied: '#60a5fa',
  Shortlisted: '#fbbf24',
  Interview: '#34d399',
  Rejected: '#f87171',
  Accepted: '#a78bfa',
}

export default function Jobs() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Manage</p>
          <h1 className="page-title">Job Applications</h1>
          <p className="page-subtitle">All your opportunities in one place.</p>
        </div>
        <button className="btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Job
        </button>
      </div>

      {/* Search + Filter bar */}
      <div className="toolbar">
        <div className="search-wrap">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input className="search-input" type="text" placeholder="Search by company, role, skill…" />
        </div>
        <select className="filter-select">
          <option>All Sources</option>
          <option>LinkedIn</option>
          <option>Bdjobs</option>
          <option>Company Website</option>
          <option>Referral</option>
          <option>Facebook</option>
        </select>
      </div>

      {/* Status Tabs */}
      <div className="status-tabs">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            className={`status-tab ${tab === 'All' ? 'status-tab--active' : ''}`}
            style={tab !== 'All' ? { '--tab-color': STATUS_COLORS[tab] } : {}}
          >
            {tab !== 'All' && (
              <span className="tab-dot" style={{ background: STATUS_COLORS[tab] }} />
            )}
            {tab}
          </button>
        ))}
      </div>

      {/* Jobs list */}
      <div className="card">
        <div className="empty-state" style={{ padding: '4rem 2rem' }}>
          <div className="empty-icon">💼</div>
          <p className="empty-title">No jobs added yet</p>
          <p className="empty-sub">Start by adding a job you found on LinkedIn, Bdjobs, or anywhere else.</p>
          <button className="btn-primary" style={{ marginTop: '1.5rem' }}>
            + Add Your First Job
          </button>
        </div>
      </div>
    </div>
  )
}