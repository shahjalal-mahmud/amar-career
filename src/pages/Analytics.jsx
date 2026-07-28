import { useMemo } from 'react'
import { useJobs } from '../hooks/useJobs'
import { STATUS_COLORS } from '../constants'

const STATUSES = Object.keys(STATUS_COLORS)

/* "—" when denom is 0, otherwise rounded percent. Matches Dashboard's
   "total > 0 && accepted > 0" pattern by simply guarding the denominator. */
function pct(num, denom) {
  if (!denom) return '—'
  return `${Math.round((num / denom) * 100)}%`
}

export default function Analytics() {
  const { jobs, loading } = useJobs()

  /* Derived stats — recomputed only when jobs change */
  const stats = useMemo(() => {
    const counts = Object.fromEntries(STATUSES.map((s) => [s, 0]))
    for (const j of jobs) {
      if (counts[j.status] !== undefined) counts[j.status] += 1
    }
    const total       = jobs.length
    const applied     = counts.Applied
    const shortlisted = counts.Shortlisted
    const interview   = counts.Interview
    const accepted    = counts.Accepted
    const maxPipeline = Math.max(...Object.values(counts), 1)
    return { counts, total, applied, shortlisted, interview, accepted, maxPipeline }
  }, [jobs])

  /* The four ratios per project.md §5.4 */
  const ratios = [
    {
      title: 'Application → Interview',
      value: pct(stats.interview, stats.applied),
      sub:   'interviews / applied',
    },
    {
      title: 'Interview → Acceptance',
      value: pct(stats.accepted, stats.interview),
      sub:   'accepted / interviews',
    },
    {
      title: 'Shortlist Rate',
      value: pct(stats.shortlisted, stats.applied),
      sub:   'shortlisted / applied',
    },
    {
      title: 'Overall Success',
      value: pct(stats.accepted, stats.total),
      sub:   'accepted / total jobs',
    },
  ]

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Insights</p>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Simple ratios from your application pipeline.</p>
        </div>
      </div>

      {loading ? (
        <div className="card">
          <div className="empty-state">
            <div className="loading-spinner-lg" />
            <p className="empty-sub" style={{ marginTop: '16px' }}>Loading…</p>
          </div>
        </div>
      ) : stats.total === 0 ? (
        <div className="card">
          <div className="empty-state" style={{ padding: '4rem 2rem' }}>
            <div className="empty-icon">📊</div>
            <p className="empty-title">No data yet</p>
            <p className="empty-sub">Your analytics will appear here after you add applications.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Four ratio cards — existing analytics-big-card pattern */}
          <div className="analytics-grid">
            {ratios.map((r) => (
              <div className="card analytics-big-card" key={r.title}>
                <h2 className="card-title">{r.title}</h2>
                <div className="big-number">{r.value}</div>
                <p className="big-number-sub">{r.sub}</p>
              </div>
            ))}
          </div>

          {/* Status breakdown — exact same pipeline-row markup as Dashboard */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Status Breakdown</h2>
            </div>
            <div className="pipeline">
              {STATUSES.map((status) => {
                const count = stats.counts[status]
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
                          width: `${(count / stats.maxPipeline) * 100}%`,
                        }}
                      />
                    </span>
                    <span className="pipeline-count">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
