import { useState, useMemo } from 'react'
import { useCompanies } from '../hooks/useCompanies'

/* ─── Default job portals (always shown, not editable from this page) ─── */
const JOB_PORTALS = [
  { name: 'BDJobs',         url: 'https://bdjobs.com',              flag: '🇧🇩', desc: 'Largest BD job board' },
  { name: 'Chakri.com',     url: 'https://www.chakri.com',          flag: '🇧🇩', desc: 'BD tech & general jobs' },
  { name: 'Job Circular BD',url: 'https://www.jobcircularbd.com',   flag: '🇧🇩', desc: 'Gov & private circulars' },
  { name: 'LinkedIn',       url: 'https://www.linkedin.com/jobs',   flag: '🌐', desc: 'Global network & jobs' },
  { name: 'Indeed',         url: 'https://bd.indeed.com',           flag: '🌐', desc: 'Global job aggregator' },
  { name: 'Glassdoor',      url: 'https://www.glassdoor.com/Job',   flag: '🌐', desc: 'Jobs + company reviews' },
  { name: 'Remotive',       url: 'https://remotive.com',            flag: '🌐', desc: 'Remote tech jobs' },
  { name: 'We Work Remotely',url:'https://weworkremotely.com',      flag: '🌐', desc: 'Remote-first roles' },
  { name: 'YC Jobs',        url: 'https://www.ycombinator.com/jobs',flag: '🌐', desc: 'Y Combinator startups' },
  { name: 'AngelList',      url: 'https://wellfound.com/jobs',      flag: '🌐', desc: 'Startup ecosystem jobs' },
]

/* ─── Tag color map ─── */
const TAG_COLORS = {
  'Software':    { bg: 'rgba(99,102,241,0.12)',  text: '#818cf8', border: 'rgba(99,102,241,0.25)' },
  'IT':          { bg: 'rgba(59,130,246,0.12)',  text: '#60a5fa', border: 'rgba(59,130,246,0.25)' },
  'Startup':     { bg: 'rgba(251,146,60,0.12)',  text: '#fb923c', border: 'rgba(251,146,60,0.25)' },
  'Fintech':     { bg: 'rgba(52,211,153,0.12)',  text: '#34d399', border: 'rgba(52,211,153,0.25)' },
  'E-commerce':  { bg: 'rgba(251,191,36,0.12)',  text: '#fbbf24', border: 'rgba(251,191,36,0.25)' },
  'Telecom':     { bg: 'rgba(167,139,250,0.12)', text: '#a78bfa', border: 'rgba(167,139,250,0.25)' },
  'Healthcare':  { bg: 'rgba(244,114,182,0.12)', text: '#f472b6', border: 'rgba(244,114,182,0.25)' },
  'NGO':         { bg: 'rgba(148,163,184,0.12)', text: '#94a3b8', border: 'rgba(148,163,184,0.25)' },
  'MNC':         { bg: 'rgba(234,179,8,0.12)',   text: '#eab308', border: 'rgba(234,179,8,0.25)'  },
  'Media':       { bg: 'rgba(236,72,153,0.12)',  text: '#ec4899', border: 'rgba(236,72,153,0.25)' },
  'Other':       { bg: 'rgba(255,255,255,0.06)', text: '#9ca3af', border: 'rgba(255,255,255,0.1)' },
}
const TAG_LIST = Object.keys(TAG_COLORS)

const REVIEW_CYCLES = ['7 days', '15 days', '30 days']
const COUNTRIES = ['Bangladesh', 'Remote', 'USA', 'UK', 'Canada', 'Australia', 'Germany', 'Singapore', 'UAE', 'India', 'Other']

const EMPTY_FORM = {
  name: '', website: '', tagline: '', tag: 'Software',
  country: 'Bangladesh', reviewCycle: '15 days', notes: '',
}

/* ─── Helpers ─── */
function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function tagColor(tag) {
  return TAG_COLORS[tag] || TAG_COLORS['Other']
}

function daysUntilNextReview(lastChecked, cycleDays) {
  if (!lastChecked) return null
  const next = new Date(lastChecked)
  next.setDate(next.getDate() + cycleDays)
  const diff = Math.ceil((next - new Date()) / 86400000)
  return diff
}

function cycleToNum(cycle) {
  return parseInt(cycle) || 15
}

function ReviewBadge({ lastChecked, reviewCycle }) {
  const days = daysUntilNextReview(lastChecked, cycleToNum(reviewCycle || '15 days'))
  if (!lastChecked) return <span style={badgeStyle('#6b7280', 'rgba(107,114,128,0.1)', 'rgba(107,114,128,0.2)')}>Never checked</span>
  if (days <= 0) return <span style={badgeStyle('#f87171', 'rgba(248,113,113,0.1)', 'rgba(248,113,113,0.25)')}>⚠ Check now</span>
  if (days <= 3) return <span style={badgeStyle('#fbbf24', 'rgba(251,191,36,0.1)', 'rgba(251,191,36,0.25)')}>Due in {days}d</span>
  return <span style={badgeStyle('#34d399', 'rgba(52,211,153,0.1)', 'rgba(52,211,153,0.25)')}>✓ {days}d left</span>
}

function badgeStyle(text, bg, border) {
  return {
    fontSize: '11px', fontWeight: '600', padding: '2px 8px',
    borderRadius: '20px', color: text, background: bg,
    border: `1px solid ${border}`, whiteSpace: 'nowrap',
  }
}

/* ─── Company form modal ─── */
function CompanyForm({ initial, onSave, onCancel, isSaving }) {
  const [form, setForm] = useState(initial ? { ...EMPTY_FORM, ...initial } : EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Company name required'
    if (!form.website.trim()) e.website = 'Website required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const save = () => { if (validate()) onSave(form) }
  const isEdit = !!initial

  const inp = (hasErr) => ({
    width: '100%', padding: '9px 12px', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.04)', border: `1.5px solid ${hasErr ? '#f87171' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: '9px', color: '#f9fafb', fontSize: '14px', fontFamily: 'inherit', outline: 'none',
  })

  return (
    <>
      <style>{`
        .cf-overlay { position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,0.7);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:16px;animation:cf-in .15s ease }
        @keyframes cf-in{from{opacity:0}to{opacity:1}}
        .cf-modal{background:#111827;border:1px solid rgba(255,255,255,0.08);border-radius:16px;width:100%;max-width:520px;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 32px 80px rgba(0,0,0,0.6);animation:cf-up .2s cubic-bezier(.16,1,.3,1);overflow:hidden}
        @keyframes cf-up{from{opacity:0;transform:translateY(20px) scale(.98)}to{opacity:1;transform:none}}
        .cf-body{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:16px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.1) transparent}
        .cf-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        @media(max-width:480px){.cf-row{grid-template-columns:1fr}}
        .cf-label{font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#9ca3af;margin-bottom:5px}
        .cf-footer{display:flex;justify-content:flex-end;gap:8px;padding:14px 20px;border-top:1px solid rgba(255,255,255,0.07)}
        .cf-header{display:flex;align-items:center;justify-content:space-between;padding:18px 20px 14px;border-bottom:1px solid rgba(255,255,255,0.07)}
        .tag-grid{display:flex;flex-wrap:wrap;gap:6px}
        .tag-chip{padding:4px 10px;border-radius:20px;border:1.5px solid;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s}
        .cf-select{width:100%;padding:9px 12px;background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.1);border-radius:9px;color:#f9fafb;font-size:14px;font-family:inherit;outline:none;appearance:none;backgroundImage:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;background-size:15px;padding-right:32px;cursor:pointer}
      `}</style>
      <div className="cf-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
        <div className="cf-modal">
          <div className="cf-header">
            <div>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#f9fafb' }}>
                {isEdit ? 'Edit Company' : 'Add Company'}
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6b7280' }}>
                Add to your target watchlist
              </p>
            </div>
            <button onClick={onCancel} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div className="cf-body">
            <div className="cf-row">
              <div>
                <div className="cf-label">Company Name *</div>
                <input style={inp(errors.name)} value={form.name} onChange={e => set('name')(e.target.value)} placeholder="e.g. bKash Limited" />
                {errors.name && <div style={{ fontSize: 11, color: '#f87171', marginTop: 4 }}>⚠ {errors.name}</div>}
              </div>
              <div>
                <div className="cf-label">Website *</div>
                <input style={inp(errors.website)} value={form.website} onChange={e => set('website')(e.target.value)} placeholder="https://bkash.com" />
                {errors.website && <div style={{ fontSize: 11, color: '#f87171', marginTop: 4 }}>⚠ {errors.website}</div>}
              </div>
            </div>

            <div>
              <div className="cf-label">Tagline</div>
              <input style={inp(false)} value={form.tagline} onChange={e => set('tagline')(e.target.value)} placeholder="e.g. Mobile financial services platform" />
            </div>

            <div>
              <div className="cf-label">Category</div>
              <div className="tag-grid">
                {TAG_LIST.map(t => {
                  const c = tagColor(t)
                  const active = form.tag === t
                  return (
                    <button key={t} className="tag-chip"
                      style={{
                        background: active ? c.bg : 'transparent',
                        color: active ? c.text : '#6b7280',
                        borderColor: active ? c.border : 'rgba(255,255,255,0.08)',
                      }}
                      onClick={() => set('tag')(t)}
                    >{t}</button>
                  )
                })}
              </div>
            </div>

            <div className="cf-row">
              <div>
                <div className="cf-label">Country</div>
                <select className="cf-select" value={form.country} onChange={e => set('country')(e.target.value)}>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <div className="cf-label">Review Cycle</div>
                <select className="cf-select" value={form.reviewCycle} onChange={e => set('reviewCycle')(e.target.value)}>
                  {REVIEW_CYCLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div>
              <div className="cf-label">Notes (optional)</div>
              <textarea
                style={{ ...inp(false), resize: 'vertical', minHeight: 70, lineHeight: 1.6 }}
                value={form.notes}
                onChange={e => set('notes')(e.target.value)}
                placeholder="Why you want to work here, contact info, LinkedIn profile…"
                rows={3}
              />
            </div>
          </div>

          <div className="cf-footer">
            <button onClick={onCancel} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#9ca3af', fontSize: 13, fontFamily: 'inherit', cursor: 'pointer' }}>Cancel</button>
            <button onClick={save} disabled={isSaving} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#6366f1', color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.6 : 1, boxShadow: '0 2px 12px rgba(99,102,241,0.35)' }}>
              {isSaving ? 'Saving…' : isEdit ? '💾 Save' : '✓ Add Company'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

/* ─── Company card ─── */
function CompanyCard({ company, onEdit, onDelete, onCheckIn }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const tc = tagColor(company.tag)
  const initials = getInitials(company.name)

  return (
    <div style={{
      background: '#111827',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '14px',
      overflow: 'hidden',
      transition: 'border-color .2s, box-shadow .2s, transform .15s',
      cursor: 'pointer',
      position: 'relative',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
    >
      {/* Color bar */}
      <div style={{ height: '3px', background: tc.text, opacity: 0.6 }} />

      <div style={{ padding: '16px' }}>
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
            {/* Logo / initials */}
            <div style={{
              width: 44, height: 44, borderRadius: 10, flexShrink: 0,
              background: tc.bg, border: `1.5px solid ${tc.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 800, color: tc.text, letterSpacing: '.03em',
              overflow: 'hidden',
            }}>
              {company.logoUrl
                ? <img src={company.logoUrl} alt={company.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                : initials
              }
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#f9fafb', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {company.name}
              </div>
              {company.tagline && (
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {company.tagline}
                </div>
              )}
            </div>
          </div>

          {/* Menu */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button
              onClick={e => { e.stopPropagation(); setMenuOpen(v => !v) }}
              style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
            </button>
            {menuOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 98 }} onClick={() => setMenuOpen(false)} />
                <div style={{ position: 'absolute', right: 0, top: 34, zIndex: 99, background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: 4, minWidth: 150, boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
                  {[
                    { label: '✓ Mark Checked', action: () => { onCheckIn(company.id); setMenuOpen(false) } },
                    { label: '✏ Edit',          action: () => { onEdit(company); setMenuOpen(false) } },
                    { label: '🗑 Delete',        action: () => { onDelete(company.id); setMenuOpen(false) }, danger: true },
                  ].map(m => (
                    <button key={m.label} onClick={m.action} style={{
                      display: 'block', width: '100%', padding: '8px 10px', border: 'none', borderRadius: 7,
                      background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
                      fontSize: 13, fontWeight: 500, textAlign: 'left',
                      color: m.danger ? '#f87171' : '#d1d5db', transition: 'background .1s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = m.danger ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.07)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                    >{m.label}</button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Badges row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12, alignItems: 'center' }}>
          <span style={{ ...badgeStyle(tc.text, tc.bg, tc.border) }}>{company.tag}</span>
          {company.country && <span style={{ fontSize: 11, color: '#6b7280', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '2px 8px' }}>📍 {company.country}</span>}
          <span style={{ marginLeft: 'auto' }}>
            <ReviewBadge lastChecked={company.lastChecked} reviewCycle={company.reviewCycle} />
          </span>
        </div>

        {/* Notes preview */}
        {company.notes && (
          <div style={{ marginTop: 10, fontSize: 12, color: '#6b7280', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {company.notes}
          </div>
        )}

        {/* Visit website CTA */}
        <a
          href={company.website?.startsWith('http') ? company.website : `https://${company.website}`}
          target="_blank" rel="noreferrer"
          onClick={e => e.stopPropagation()}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            marginTop: 14, padding: '7px 0', borderRadius: 8,
            background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
            color: '#818cf8', fontSize: 12, fontWeight: 600, textDecoration: 'none',
            transition: 'all .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; e.currentTarget.style.color = '#a5b4fc' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.color = '#818cf8' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          Visit Website
        </a>
      </div>
    </div>
  )
}

/* ─── Portal card ─── */
function PortalCard({ portal }) {
  return (
    <a
      href={portal.url} target="_blank" rel="noreferrer"
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
        background: '#111827', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12, textDecoration: 'none', transition: 'all .15s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)'; e.currentTarget.style.background = 'rgba(99,102,241,0.05)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = '#111827'; e.currentTarget.style.transform = 'none' }}
    >
      <div style={{ fontSize: 22, flexShrink: 0, width: 32, textAlign: 'center' }}>{portal.flag}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#e5e7eb' }}>{portal.name}</div>
        <div style={{ fontSize: 11, color: '#6b7280', marginTop: 1 }}>{portal.desc}</div>
      </div>
      <svg viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" width="14" height="14" style={{ flexShrink: 0 }}>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
    </a>
  )
}

/* ─── Main page ─── */
export default function Companies() {
  const { companies, loading, createCompany, updateCompany, deleteCompany } = useCompanies()
  const [formOpen, setFormOpen] = useState(false)
  const [editCompany, setEditCompany] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [filterTag, setFilterTag] = useState('All')
  const [filterCountry, setFilterCountry] = useState('All')

  const openCreate = () => { setEditCompany(null); setFormOpen(true) }
  const openEdit = (c) => { setEditCompany(c); setFormOpen(true) }
  const closeForm = () => { setFormOpen(false); setEditCompany(null) }

  const handleSave = async (data) => {
    setIsSaving(true)
    try {
      if (editCompany) await updateCompany(editCompany.id, data)
      else await createCompany(data)
      closeForm()
    } catch (err) {
      console.error(err)
      alert('Failed to save. Check Firebase config.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this company from your watchlist?')) return
    await deleteCompany(id)
  }

  const handleCheckIn = async (id) => {
    await updateCompany(id, { lastChecked: new Date().toISOString() })
  }

  /* Derived filter lists */
  const usedTags = useMemo(() => ['All', ...TAG_LIST.filter(t => companies.some(c => c.tag === t))], [companies])
  const usedCountries = useMemo(() => {
    const s = new Set(companies.map(c => c.country).filter(Boolean))
    return ['All', ...Array.from(s).sort()]
  }, [companies])

  const filtered = useMemo(() => {
    return companies.filter(c => {
      const q = search.toLowerCase()
      const matchSearch = !q || c.name?.toLowerCase().includes(q) || c.tagline?.toLowerCase().includes(q) || c.notes?.toLowerCase().includes(q)
      const matchTag = filterTag === 'All' || c.tag === filterTag
      const matchCountry = filterCountry === 'All' || c.country === filterCountry
      return matchSearch && matchTag && matchCountry
    })
  }, [companies, search, filterTag, filterCountry])

  /* Stats */
  const dueNow = companies.filter(c => {
    const d = daysUntilNextReview(c.lastChecked, cycleToNum(c.reviewCycle || '15 days'))
    return d !== null && d <= 0
  }).length

  const neverChecked = companies.filter(c => !c.lastChecked).length

  return (
    <>
      <style>{`
        .companies-page { display: flex; flex-direction: column; gap: 28px; }

        .section-title {
          font-size: 12px; font-weight: 700; letter-spacing: .08em;
          text-transform: uppercase; color: #6b7280; margin: 0 0 14px;
          display: flex; align-items: center; gap: 8px;
        }
        .section-title::after { content:''; flex:1; height:1px; background:rgba(255,255,255,0.06); }

        .portals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 10px;
        }

        .companies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 14px;
        }

        .filter-bar { display:flex; flex-wrap:wrap; gap:8px; align-items:center; }

        .filter-chip {
          padding: 5px 13px; border-radius: 20px; border: 1.5px solid rgba(255,255,255,0.08);
          background: transparent; color: #6b7280; font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all .15s; font-family: inherit;
        }
        .filter-chip:hover { color: #d1d5db; border-color: rgba(255,255,255,0.15); }
        .filter-chip--active { background: rgba(99,102,241,0.12); border-color: rgba(99,102,241,0.35); color: #818cf8; }

        .stat-strip {
          display: flex; gap: 12px; flex-wrap: wrap;
        }
        .strip-stat {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 16px; background: #111827;
          border: 1px solid rgba(255,255,255,0.07); border-radius: 10px;
          flex: 1; min-width: 120px;
        }
        .strip-val { font-size: 22px; font-weight: 800; line-height: 1; }
        .strip-lbl { font-size: 11px; color: #6b7280; margin-top: 2px; }

        .search-box {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 12px;
          background: rgba(255,255,255,0.04); border: 1.5px solid rgba(255,255,255,0.09);
          border-radius: 10px; flex: 1; min-width: 200px; max-width: 360px;
        }
        .search-box input {
          background: none; border: none; outline: none; color: #f9fafb;
          font-size: 14px; font-family: inherit; flex: 1;
        }
        .search-box input::placeholder { color: #4b5563; }

        @media(max-width:600px) {
          .companies-grid { grid-template-columns: 1fr; }
          .portals-grid { grid-template-columns: 1fr 1fr; }
        }
        @media(max-width:400px) {
          .portals-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {formOpen && (
        <CompanyForm
          initial={editCompany}
          onSave={handleSave}
          onCancel={closeForm}
          isSaving={isSaving}
        />
      )}

      <div className="companies-page">

        {/* Page header */}
        <div className="page-header">
          <div>
            <p className="page-eyebrow">Watchlist</p>
            <h1 className="page-title">Target Companies</h1>
            <p className="page-subtitle">
              {companies.length} compan{companies.length === 1 ? 'y' : 'ies'} tracked
              {dueNow > 0 && <span style={{ color: '#f87171', marginLeft: 8 }}>· ⚠ {dueNow} due for check</span>}
            </p>
          </div>
          <button className="btn-primary" onClick={openCreate}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Company
          </button>
        </div>

        {/* ── Job Portals section ── */}
        <section>
          <h2 className="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            Job Portals — check all
          </h2>
          <div className="portals-grid">
            {JOB_PORTALS.map(p => <PortalCard key={p.name} portal={p} />)}
          </div>
        </section>

        {/* ── Stats strip ── */}
        {companies.length > 0 && (
          <div className="stat-strip">
            {[
              { val: companies.length, lbl: 'Companies tracked', color: '#818cf8' },
              { val: dueNow,           lbl: 'Due for review',    color: '#f87171' },
              { val: neverChecked,     lbl: 'Never checked',     color: '#fbbf24' },
              { val: companies.length - dueNow - neverChecked, lbl: 'Up to date', color: '#34d399' },
            ].map(s => (
              <div className="strip-stat" key={s.lbl}>
                <div>
                  <div className="strip-val" style={{ color: s.color }}>{s.val}</div>
                  <div className="strip-lbl">{s.lbl}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Companies watchlist ── */}
        <section>
          <h2 className="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            Company Watchlist
          </h2>

          {/* Filters */}
          {companies.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <div className="search-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" width="15" height="15"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies…" />
                  {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: 0, fontSize: 13 }}>✕</button>}
                </div>
              </div>
              <div className="filter-bar">
                {usedTags.map(t => (
                  <button key={t} className={`filter-chip ${filterTag === t ? 'filter-chip--active' : ''}`} onClick={() => setFilterTag(t)}>{t}</button>
                ))}
              </div>
              {usedCountries.length > 2 && (
                <div className="filter-bar">
                  {usedCountries.map(c => (
                    <button key={c} className={`filter-chip ${filterCountry === c ? 'filter-chip--active' : ''}`} onClick={() => setFilterCountry(c)}>{c}</button>
                  ))}
                </div>
              )}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>Loading…</div>
          ) : companies.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', background: '#111827', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🏢</div>
              <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#e5e7eb' }}>No companies yet</p>
              <p style={{ margin: '0 0 20px', fontSize: 13, color: '#6b7280' }}>Add your dream companies and check back regularly for openings.</p>
              <button className="btn-primary" onClick={openCreate}>+ Add First Company</button>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280', fontSize: 14 }}>
              🔍 No companies match your filters.
            </div>
          ) : (
            <div className="companies-grid">
              {filtered.map(c => (
                <CompanyCard
                  key={c.id}
                  company={c}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onCheckIn={handleCheckIn}
                />
              ))}
            </div>
          )}
        </section>

      </div>
    </>
  )
}