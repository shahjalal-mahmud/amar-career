import { useState } from 'react'
import { useJobs } from '../hooks/useJobs'
import JobForm from '../components/JobForm'

const STATUS_COLORS = {
  Saved: '#94a3b8', Applied: '#60a5fa', Shortlisted: '#fbbf24',
  Interview: '#34d399', Rejected: '#f87171', Accepted: '#a78bfa',
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function Dashboard({ onNavigate }) {
  const { jobs, loading, createJob } = useJobs()

  const [formOpen, setFormOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (formData) => {
    setIsSaving(true)
    try {
      await createJob(formData)
      setFormOpen(false)
    } catch (err) {
      alert('Failed to save. Check your Firebase config.')
    } finally {
      setIsSaving(false)
    }
  }

  // Computed stats
  const total     = jobs.length
  const applied   = jobs.filter((j) => j.status === 'Applied').length
  const interview = jobs.filter((j) => j.status === 'Interview').length
  const rejected  = jobs.filter((j) => j.status === 'Rejected').length
  const accepted  = jobs.filter((j) => j.status === 'Accepted').length

  const STATS = [
    { label: 'Jobs Saved',  value: total,     icon: '📋', color: 'var(--accent)' },
    { label: 'Applied',     value: applied,   icon: '📤', color: '#60a5fa' },
    { label: 'Interviews',  value: interview, icon: '🎯', color: '#34d399' },
    { label: 'Rejected',    value: rejected,  icon: '❌', color: '#f87171' },
  ]

  const recent = jobs.slice(0, 5)

  const pipelineCounts = Object.fromEntries(
    Object.keys(STATUS_COLORS).map((s) => [s, jobs.filter((j) => j.status === s).length])
  )
  const maxPipeline = Math.max(...Object.values(pipelineCounts), 1)

  return (
    <>
      {formOpen && (
        <JobForm
          initialData={null}
          onSave={handleSave}
          onCancel={() => setFormOpen(false)}
          isSaving={isSaving}
        />
      )}

      <div className="page">
        <div className="page-header">
          <div>
            <p className="page-eyebrow">Welcome back</p>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Track your job hunt progress at a glance.</p>
          </div>
          <button className="btn-primary" onClick={() => setFormOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Job
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {STATS.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value" style={{ color: stat.color }}>
                {loading ? '—' : stat.value}
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Two cols */}
        <div className="dashboard-cols">
          {/* Recent */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Applications</h2>
              <button className="card-action" onClick={() => onNavigate('jobs')}>View all →</button>
            </div>
            {loading ? (
              <p className="empty-sub" style={{ padding: '20px 0', textAlign: 'center' }}>Loading…</p>
            ) : recent.length === 0 ? (
              <div className="empty-state" style={{ padding: '24px 0' }}>
                <div className="empty-icon">📂</div>
                <p className="empty-title">No applications yet</p>
                <p className="empty-sub">Add your first job to get started.</p>
              </div>
            ) : (
              <div className="recent-list">
                {recent.map((job) => {
                  const c = STATUS_COLORS[job.status] || STATUS_COLORS.Saved
                  return (
                    <div className="recent-item" key={job.id}>
                      <div className="recent-dot" style={{ background: c }} />
                      <div className="recent-info">
                        <p className="recent-title">{job.jobTitle || 'Untitled'}</p>
                        <p className="recent-company">{job.companyName}</p>
                      </div>
                      <div className="recent-right">
                        <span className="recent-status" style={{ color: c }}>{job.status}</span>
                        <span className="recent-date">{formatDate(job.createdAt)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Pipeline */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Pipeline Status</h2>
            </div>
            <div className="pipeline">
              {Object.entries(pipelineCounts).map(([status, count]) => {
                const color = STATUS_COLORS[status]
                return (
                  <div className="pipeline-row" key={status}>
                    <span className="pipeline-dot" style={{ background: color }} />
                    <span className="pipeline-status">{status}</span>
                    <span className="pipeline-bar-wrap">
                      <span
                        className="pipeline-bar"
                        style={{
                          background: color,
                          width: loading ? '0%' : `${(count / maxPipeline) * 100}%`,
                        }}
                      />
                    </span>
                    <span className="pipeline-count">{loading ? '—' : count}</span>
                  </div>
                )
              })}
            </div>
            {total > 0 && accepted > 0 && (
              <div className="pipeline-success">
                🎉 Success rate: {Math.round((accepted / total) * 100)}%
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Quick Actions</h2>
          </div>
          <div className="quick-actions">
            {[
              { icon: '➕', label: 'Add New Job',     sub: 'Save a new opportunity',    action: () => setFormOpen(true) },
              { icon: '📝', label: 'Write Notes',      sub: 'Interview prep & learnings', action: () => onNavigate('notes') },
              { icon: '👤', label: 'Update Profile',   sub: 'Skills & portfolio links',   action: () => onNavigate('profile') },
              { icon: '📊', label: 'View Analytics',   sub: 'Application statistics',     action: () => onNavigate('analytics') },
            ].map((qa) => (
              <button className="quick-action-btn" key={qa.label} onClick={qa.action}>
                <span className="qa-icon">{qa.icon}</span>
                <span className="qa-label">{qa.label}</span>
                <span className="qa-sub">{qa.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}