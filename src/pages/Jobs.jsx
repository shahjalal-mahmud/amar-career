import { useState, useMemo } from 'react'
import { useJobs } from '../hooks/useJobs'
import JobForm from '../components/JobForm'
import JobCard from '../components/JobCard'

const STATUS_TABS = ['All', 'Saved', 'Applied', 'Shortlisted', 'Interview', 'Rejected', 'Accepted']
const STATUS_COLORS = {
  Saved: '#94a3b8', Applied: '#60a5fa', Shortlisted: '#fbbf24',
  Interview: '#34d399', Rejected: '#f87171', Accepted: '#a78bfa',
}

export default function Jobs() {
  const { jobs, loading, createJob, updateJob, updateJobStatus, deleteJob } = useJobs()

  const [formOpen, setFormOpen] = useState(false)
  const [editJob, setEditJob]   = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch]     = useState('')

  const openCreate = () => { setEditJob(null); setFormOpen(true) }
  const openEdit   = (job) => { setEditJob(job); setFormOpen(true) }
  const closeForm  = () => { setFormOpen(false); setEditJob(null) }

  const handleSave = async (formData) => {
    setIsSaving(true)
    try {
      if (editJob) {
        await updateJob(editJob.id, formData)
      } else {
        await createJob(formData)
      }
      closeForm()
    } catch (err) {
      console.error('Save failed:', err)
      alert('Failed to save. Check your Firebase config and Firestore rules.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job? This cannot be undone.')) return
    await deleteJob(id)
  }

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const matchTab = activeTab === 'All' || j.status === activeTab
      const q = search.toLowerCase()
      const matchSearch = !q
        || j.jobTitle?.toLowerCase().includes(q)
        || j.companyName?.toLowerCase().includes(q)
        || j.notes?.toLowerCase().includes(q)
        || j.salary?.toLowerCase().includes(q)
      return matchTab && matchSearch
    })
  }, [jobs, activeTab, search])

  const counts = useMemo(() => {
    const c = {}
    STATUS_TABS.forEach((t) => {
      c[t] = t === 'All' ? jobs.length : jobs.filter((j) => j.status === t).length
    })
    return c
  }, [jobs])

  return (
    <>
      {formOpen && (
        <JobForm
          initialData={editJob}
          onSave={handleSave}
          onCancel={closeForm}
          isSaving={isSaving}
        />
      )}

      <div className="page">
        <div className="page-header">
          <div>
            <p className="page-eyebrow">Manage</p>
            <h1 className="page-title">Job Applications</h1>
            <p className="page-subtitle">
              {jobs.length} opportunit{jobs.length === 1 ? 'y' : 'ies'} tracked so far.
            </p>
          </div>
          <button className="btn-primary" onClick={openCreate}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Job
          </button>
        </div>

        <div className="toolbar">
          <div className="search-wrap">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company, role, salary, notes…"
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>
        </div>

        <div className="status-tabs">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              className={`status-tab ${activeTab === tab ? 'status-tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab !== 'All' && <span className="tab-dot" style={{ background: STATUS_COLORS[tab] }} />}
              {tab}
              {counts[tab] > 0 && <span className="tab-count">{counts[tab]}</span>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="card">
            <div className="empty-state">
              <div className="loading-spinner-lg" />
              <p className="empty-sub" style={{ marginTop: '16px' }}>Loading jobs…</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card">
            <div className="empty-state" style={{ padding: '4rem 2rem' }}>
              <div className="empty-icon">{jobs.length === 0 ? '💼' : '🔍'}</div>
              <p className="empty-title">
                {jobs.length === 0 ? 'No jobs added yet' : 'No matching jobs'}
              </p>
              <p className="empty-sub">
                {jobs.length === 0
                  ? 'Start by adding a job — takes less than a minute.'
                  : 'Try adjusting your search or filters.'}
              </p>
              {jobs.length === 0 && (
                <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={openCreate}>
                  + Add Your First Job
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="jobs-list">
            {filtered.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={openEdit}
                onDelete={handleDelete}
                onStatusChange={updateJobStatus}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}