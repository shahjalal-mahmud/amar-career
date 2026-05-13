export default function Analytics() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Insights</p>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Understand your application patterns and success rate.</p>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Success Rate */}
        <div className="card analytics-big-card">
          <h2 className="card-title">Success Rate</h2>
          <div className="big-number">—</div>
          <p className="big-number-sub">Add applications to see your rate</p>
        </div>

        {/* Response Rate */}
        <div className="card analytics-big-card">
          <h2 className="card-title">Response Rate</h2>
          <div className="big-number">—</div>
          <p className="big-number-sub">Shortlisted / Total Applied</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Applications by Source</h2>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <p className="empty-title">No data yet</p>
          <p className="empty-sub">Your analytics will appear here after you add applications.</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Application Timeline</h2>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <p className="empty-title">Timeline empty</p>
          <p className="empty-sub">Track when and how often you apply.</p>
        </div>
      </div>
    </div>
  )
}