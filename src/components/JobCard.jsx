import { useState } from 'react'
import { renderMarkdown } from './JobForm'

const STATUS = {
  Saved:       { bg: 'rgba(148,163,184,0.1)', text: '#94a3b8', border: 'rgba(148,163,184,0.2)', dot: '#94a3b8' },
  Applied:     { bg: 'rgba(96,165,250,0.1)',  text: '#60a5fa', border: 'rgba(96,165,250,0.2)',  dot: '#60a5fa' },
  Shortlisted: { bg: 'rgba(251,191,36,0.1)',  text: '#fbbf24', border: 'rgba(251,191,36,0.2)',  dot: '#fbbf24' },
  Interview:   { bg: 'rgba(52,211,153,0.1)',  text: '#34d399', border: 'rgba(52,211,153,0.2)',  dot: '#34d399' },
  Rejected:    { bg: 'rgba(248,113,113,0.1)', text: '#f87171', border: 'rgba(248,113,113,0.2)', dot: '#f87171' },
  Accepted:    { bg: 'rgba(167,139,250,0.1)', text: '#a78bfa', border: 'rgba(167,139,250,0.2)', dot: '#a78bfa' },
}
const STATUSES = Object.keys(STATUS)

function formatDate(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const IconEdit = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)
const IconChevron = ({ up }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12"
    style={{ transform: up ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)
const IconCopy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
)
const IconLink = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
)

export default function JobCard({ job, onEdit, onDelete, onStatusChange }) {
  const color = STATUS[job.status] || STATUS.Saved
  const [statusOpen, setStatusOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(job.notes || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <style>{`
        .job-card {
          background: #111827;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          overflow: visible;
          position: relative;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .job-card:hover {
          border-color: rgba(255,255,255,0.12);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }

        .job-card-inner {
          display: flex;
          gap: 0;
        }

        /* Left accent bar */
        .job-card-bar {
          width: 3px;
          border-radius: 14px 0 0 14px;
          flex-shrink: 0;
          align-self: stretch;
          opacity: 0.7;
        }

        .job-card-content {
          flex: 1;
          padding: 16px 18px;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* Row: status badge + actions */
        .job-card-row-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .status-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 10px; border-radius: 20px; border: 1px solid;
          font-size: 12px; font-weight: 600; cursor: pointer;
          transition: opacity 0.15s;
          white-space: nowrap;
        }
        .status-badge:hover { opacity: 0.85; }

        .status-dot {
          width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
        }

        .status-dropdown {
          position: absolute; top: calc(100% + 6px); left: 0; z-index: 100;
          background: #1f2937;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 11px;
          padding: 5px;
          min-width: 160px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.5);
          animation: dropdown-in 0.12s ease;
        }
        @keyframes dropdown-in { from { opacity:0; transform: translateY(-4px) scale(0.98) } to { opacity:1; transform: none } }

        .status-opt {
          display: flex; align-items: center; gap: 9px;
          padding: 8px 10px; border-radius: 7px; border: none;
          background: transparent; cursor: pointer; width: 100%;
          font-size: 13px; font-weight: 500; font-family: inherit;
          color: #d1d5db; transition: background 0.1s;
          text-align: left;
        }
        .status-opt:hover { background: rgba(255,255,255,0.07); }
        .status-opt--active { color: #fff; font-weight: 600; }

        /* Actions */
        .job-actions {
          display: flex; align-items: center; gap: 4px;
        }
        .job-action {
          width: 30px; height: 30px; border-radius: 7px; border: 1px solid rgba(255,255,255,0.08);
          background: transparent; cursor: pointer; color: #6b7280;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .job-action:hover { background: rgba(255,255,255,0.07); color: #d1d5db; border-color: rgba(255,255,255,0.14); }
        .job-action--danger:hover { background: rgba(248,113,113,0.1); color: #f87171; border-color: rgba(248,113,113,0.2); }

        /* Main content */
        .job-title { margin: 0; font-size: 16px; font-weight: 700; color: #f9fafb; line-height: 1.3; }
        .job-company { margin: 2px 0 0; font-size: 13px; color: #9ca3af; }

        /* Badges row */
        .job-badges {
          display: flex; flex-wrap: wrap; gap: 6px; align-items: center;
        }
        .job-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 9px; border-radius: 20px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
          font-size: 12px; color: #9ca3af; font-weight: 500;
          text-decoration: none; transition: all 0.15s; white-space: nowrap;
        }
        a.job-badge:hover { background: rgba(255,255,255,0.09); color: #d1d5db; border-color: rgba(255,255,255,0.14); }

        /* Chips (salary/links) */
        .job-chips {
          display: flex; flex-wrap: wrap; gap: 6px;
        }
        .job-chip {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 7px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          font-size: 12px; color: #6b7280; text-decoration: none;
          transition: all 0.15s; white-space: nowrap;
        }
        a.job-chip:hover { background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.25); color: #818cf8; }

        /* Notes */
        .job-notes {
          border-radius: 9px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          overflow: hidden;
        }
        .job-notes-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          gap: 8px;
        }
        .job-notes-label {
          font-size: 11px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.07em; color: #6b7280;
        }
        .job-notes-actions { display: flex; gap: 4px; }
        .notes-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 9px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.08);
          background: transparent; cursor: pointer; font-size: 11px;
          font-weight: 500; font-family: inherit; color: #6b7280;
          transition: all 0.15s;
        }
        .notes-btn:hover { background: rgba(255,255,255,0.06); color: #d1d5db; }

        .notes-body {
          padding: 12px; font-size: 13px; line-height: 1.65;
          color: #9ca3af;
        }
        .notes-body p { margin: 0 0 8px; }
        .notes-body p:last-child { margin-bottom: 0; }
        .notes-body h1, .notes-body h2, .notes-body h3 { color: #e5e7eb; margin: 12px 0 5px; font-size: 14px; }
        .notes-body ul, .notes-body ol { padding-left: 18px; margin: 0 0 8px; }
        .notes-body li { margin-bottom: 2px; }
        .notes-body code { background: rgba(255,255,255,0.07); padding: 1px 5px; border-radius: 4px; font-size: 12px; }
        .notes-body a { color: #6366f1; }
        .notes-body blockquote { border-left: 2px solid #6366f1; padding-left: 10px; color: #6b7280; }
        .notes-body hr { border: none; border-top: 1px solid rgba(255,255,255,0.07); margin: 10px 0; }

        /* Footer */
        .job-card-footer {
          display: flex; align-items: center; justify-content: flex-end;
          padding-top: 2px;
        }
        .job-date {
          font-size: 11px; color: #4b5563;
        }

        @media (max-width: 480px) {
          .job-card-content { padding: 14px; }
          .job-title { font-size: 15px; }
        }
      `}</style>

      <div className="job-card">
        <div className="job-card-inner">
          {/* Accent bar */}
          <div className="job-card-bar" style={{ background: color.dot }} />

          <div className="job-card-content">

            {/* Top row: status + actions */}
            <div className="job-card-row-top">
              <div style={{ position: 'relative' }}>
                <button
                  className="status-badge"
                  style={{ background: color.bg, color: color.text, borderColor: color.border }}
                  onClick={() => setStatusOpen(v => !v)}
                >
                  <span className="status-dot" style={{ background: color.dot }} />
                  {job.status}
                  <IconChevron up={statusOpen} />
                </button>

                {statusOpen && (
                  <>
                    {/* click-away */}
                    <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setStatusOpen(false)} />
                    <div className="status-dropdown" style={{ zIndex: 100 }}>
                      {STATUSES.map(s => {
                        const c = STATUS[s]
                        return (
                          <button
                            key={s}
                            className={`status-opt ${job.status === s ? 'status-opt--active' : ''}`}
                            onClick={() => { onStatusChange(job.id, s); setStatusOpen(false) }}
                          >
                            <span className="status-dot" style={{ background: c.dot }} />
                            {s}
                            {job.status === s && <span style={{ marginLeft: 'auto', fontSize: '11px', color: c.dot }}>✓</span>}
                          </button>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>

              <div className="job-actions">
                <button className="job-action" onClick={() => onEdit(job)} title="Edit">
                  <IconEdit />
                </button>
                <button className="job-action job-action--danger" onClick={() => onDelete(job.id)} title="Delete">
                  <IconTrash />
                </button>
              </div>
            </div>

            {/* Title / company */}
            <div>
              <h3 className="job-title">{job.jobTitle || 'Untitled Position'}</h3>
              <p className="job-company">{job.companyName || 'Unknown Company'}</p>
            </div>

            {/* Type / location / CV badges */}
            {(job.jobType || job.location || job.cvLink) && (
              <div className="job-badges">
                {job.jobType && <span className="job-badge">💼 {job.jobType}</span>}
                {job.location && <span className="job-badge">📍 {job.location}</span>}
                {job.cvLink && (
                  <a href={job.cvLink} target="_blank" rel="noreferrer" className="job-badge">
                    📄 CV Version
                  </a>
                )}
              </div>
            )}

            {/* Salary / circular / website chips */}
            {(job.salary || job.circularLink || job.companyWebsite) && (
              <div className="job-chips">
                {job.salary && <span className="job-chip">💰 {job.salary}</span>}
                {job.circularLink && (
                  <a
                    href={job.circularLink.startsWith('http') ? job.circularLink : `https://${job.circularLink}`}
                    target="_blank" rel="noreferrer"
                    className="job-chip"
                    onClick={e => e.stopPropagation()}
                  >
                    <IconLink /> Circular
                  </a>
                )}
                {job.companyWebsite && (
                  <a
                    href={job.companyWebsite.startsWith('http') ? job.companyWebsite : `https://${job.companyWebsite}`}
                    target="_blank" rel="noreferrer"
                    className="job-chip"
                    onClick={e => e.stopPropagation()}
                  >
                    <IconLink /> Website
                  </a>
                )}
              </div>
            )}

            {/* Notes */}
            {job.notes && (
              <div className="job-notes">
                <div className="job-notes-header">
                  <span className="job-notes-label">📋 Notes</span>
                  <div className="job-notes-actions">
                    <button className="notes-btn" onClick={handleCopy}>
                      <IconCopy />
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button className="notes-btn" onClick={() => setExpanded(v => !v)}>
                      {expanded ? '▲ Less' : '▼ More'}
                    </button>
                  </div>
                </div>
                <div
                  className="notes-body"
                  dangerouslySetInnerHTML={{
                    __html: expanded
                      ? renderMarkdown(job.notes)
                      : renderMarkdown(job.notes.substring(0, 180) + (job.notes.length > 180 ? '…' : ''))
                  }}
                />
              </div>
            )}

            {/* Footer */}
            {job.createdAt && (
              <div className="job-card-footer">
                <span className="job-date">Added {formatDate(job.createdAt)}</span>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}