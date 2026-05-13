const NOTE_CATEGORIES = [
  { icon: '❓', label: 'Interview Questions', count: 0 },
  { icon: '📚', label: 'Preparation Notes', count: 0 },
  { icon: '⚡', label: 'Mistakes & Learnings', count: 0 },
  { icon: '🎯', label: 'Role-Specific Prep', count: 0 },
]

export default function Notes() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Preparation</p>
          <h1 className="page-title">Notes</h1>
          <p className="page-subtitle">Interview prep, learnings, and role-specific materials.</p>
        </div>
        <button className="btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Note
        </button>
      </div>

      {/* Category cards */}
      <div className="notes-category-grid">
        {NOTE_CATEGORIES.map((cat) => (
          <div className="card note-category-card" key={cat.label}>
            <span className="nc-icon">{cat.icon}</span>
            <h3 className="nc-label">{cat.label}</h3>
            <span className="nc-count">{cat.count} notes</span>
          </div>
        ))}
      </div>

      {/* All notes */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Notes</h2>
          <div className="search-wrap" style={{ maxWidth: '260px' }}>
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input className="search-input" type="text" placeholder="Search notes…" />
          </div>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <p className="empty-title">No notes yet</p>
          <p className="empty-sub">Save interview questions, prep notes, and learnings here.</p>
        </div>
      </div>
    </div>
  )
}