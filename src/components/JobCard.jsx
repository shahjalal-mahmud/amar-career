import { useState } from 'react'
import { renderMarkdown } from './JobForm'

const STATUS_COLORS = {
  Saved:       { bg: 'rgba(148,163,184,0.12)', text: '#94a3b8', border: 'rgba(148,163,184,0.25)' },
  Applied:     { bg: 'rgba(96,165,250,0.12)',  text: '#60a5fa', border: 'rgba(96,165,250,0.25)'  },
  Shortlisted: { bg: 'rgba(251,191,36,0.12)',  text: '#fbbf24', border: 'rgba(251,191,36,0.25)'  },
  Interview:   { bg: 'rgba(52,211,153,0.12)',  text: '#34d399', border: 'rgba(52,211,153,0.25)'  },
  Rejected:    { bg: 'rgba(248,113,113,0.12)', text: '#f87171', border: 'rgba(248,113,113,0.25)' },
  Accepted:    { bg: 'rgba(167,139,250,0.12)', text: '#a78bfa', border: 'rgba(167,139,250,0.25)' },
}

const STATUSES = ['Saved', 'Applied', 'Shortlisted', 'Interview', 'Rejected', 'Accepted']

function formatDate(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function JobCard({ job, onEdit, onDelete, onStatusChange }) {
  const color = STATUS_COLORS[job.status] || STATUS_COLORS.Saved
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(job.notes || '')
    alert('✅ Markdown content copied to clipboard!')
  }

  return (
    <div className="job-card">
      <div className="job-card-bar" style={{ background: color.text }} />

      <div className="job-card-body">
        {/* Top row */}
        <div className="job-card-top">
          <div className="job-status-wrap">
            <button
              className="job-status-badge"
              style={{ background: color.bg, color: color.text, borderColor: color.border }}
              onClick={() => setShowStatusMenu((v) => !v)}
              title="Change status"
            >
              {job.status}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="10" height="10">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {showStatusMenu && (
              <div className="status-dropdown">
                {STATUSES.map((s) => {
                  const c = STATUS_COLORS[s]
                  return (
                    <button
                      key={s}
                      className={`status-option ${job.status === s ? 'status-option--active' : ''}`}
                      style={{ '--opt-color': c.text }}
                      onClick={() => {
                        onStatusChange(job.id, s)
                        setShowStatusMenu(false)
                      }}
                    >
                      <span className="status-option-dot" style={{ background: c.text }} />
                      {s}
                      {job.status === s && ' ✓'}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="job-card-actions">
            <button className="job-action-btn" onClick={() => onEdit(job)} title="Edit job">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button className="job-action-btn job-action-btn--danger" onClick={() => onDelete(job.id)} title="Delete job">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </button>
          </div>
        </div>

        {/* Main info */}
        <div className="job-card-main">
          <h3 className="job-title">{job.jobTitle || 'Untitled Position'}</h3>
          <p className="job-company">{job.companyName || 'Unknown Company'}</p>
          
          {/* Job Type & Location badges */}
          <div className="job-meta-badges">
            {job.jobType && (
              <span className="job-meta-badge">
                💼 {job.jobType}
              </span>
            )}
            {job.location && (
              <span className="job-meta-badge">
                📍 {job.location}
              </span>
            )}
            {job.cvLink && (
              <a 
                href={job.cvLink} 
                target="_blank" 
                rel="noreferrer" 
                className="job-meta-badge job-meta-link"
              >
                📄 CV Version
              </a>
            )}
          </div>
        </div>

        {/* Detail chips */}
        <div className="job-card-chips">
          {job.salary && (
            <span className="job-chip">💰 {job.salary}</span>
          )}
          {job.circularLink && (
            <a
              href={job.circularLink.startsWith('http') ? job.circularLink : `https://${job.circularLink}`}
              target="_blank"
              rel="noreferrer"
              className="job-chip job-chip-link"
              onClick={(e) => e.stopPropagation()}
            >
              📄 Circular
            </a>
          )}
          {job.companyWebsite && (
            <a
              href={job.companyWebsite.startsWith('http') ? job.companyWebsite : `https://${job.companyWebsite}`}
              target="_blank"
              rel="noreferrer"
              className="job-chip job-chip-link"
              onClick={(e) => e.stopPropagation()}
            >
              🌐 Website
            </a>
          )}
        </div>

        {/* Notes section with expand/collapse and copy button */}
        {job.notes && (
          <div className="job-notes-section">
            <div className="job-notes-header">
              <span className="job-notes-label">📋 Job Details (Markdown)</span>
              <div className="job-notes-buttons">
                <button className="job-notes-btn" onClick={handleCopyMarkdown} title="Copy markdown text">
                  📋 Copy Markdown
                </button>
                <button className="job-notes-btn" onClick={() => setExpanded(!expanded)} title={expanded ? "Collapse" : "Expand"}>
                  {expanded ? '▼ Collapse' : '▶ Expand'}
                </button>
              </div>
            </div>
            {expanded ? (
              <div 
                className="job-notes-expanded" 
                dangerouslySetInnerHTML={{ __html: renderMarkdown(job.notes) }}
              />
            ) : (
              <div 
                className="job-notes-preview" 
                dangerouslySetInnerHTML={{ 
                  __html: renderMarkdown(job.notes.substring(0, 200) + (job.notes.length > 200 ? '…' : ''))
                }}
              />
            )}
          </div>
        )}

        {/* Footer */}
        <div className="job-card-footer">
          <span className="job-added">Added {formatDate(job.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}