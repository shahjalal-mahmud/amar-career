import { profile } from '../data/profile'

/* ════════════════════════════════════════════════════════
   MAIN PROFILE PAGE
════════════════════════════════════════════════════════ */
export default function Profile() {
  const p = profile

  return (
    <div className="page">
      {/* ── Page header ── */}
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Personal</p>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Engineering background, projects, and career information.</p>
        </div>
        <a
          href={p.links.find(l => l.id === 'portfolio')?.url}
          target="_blank"
          rel="noreferrer"
          className="btn-primary"
          style={{ textDecoration: 'none' }}
        >
          <span>↗</span> View Portfolio
        </a>
      </div>

      {/* ── Hero card ── */}
      <div className="card" style={{ padding: '28px 28px 24px' }}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Avatar */}
          <div style={{
            width: 80, height: 80, borderRadius: '50%', flexShrink: 0,
            background: 'rgba(245,158,11,0.12)', border: '2px solid rgba(245,158,11,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--accent)',
          }}>
            {p.basic.initials}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800,
                color: 'var(--text-primary)', margin: 0,
              }}>{p.basic.name}</h2>
              {p.basic.statusActive && (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 9999,
                  background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)',
                  color: '#34d399', fontFamily: 'var(--font-display)',
                }}>● {p.basic.status}</span>
              )}
            </div>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', margin: '0 0 6px' }}>
              {p.basic.title} · {p.basic.companyRole}
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
              📍 {p.basic.location} &nbsp;·&nbsp; 🎓 {p.basic.university}
            </p>

            {/* Links row */}
            <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
              {p.links.map(link => (
                <a key={link.id} href={link.url} target="_blank" rel="noreferrer"
                  style={{
                    fontSize: 12, fontWeight: 600, color: 'var(--accent)',
                    background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                    borderRadius: 6, padding: '5px 12px', textDecoration: 'none',
                    fontFamily: 'var(--font-display)', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => e.target.style.background = 'rgba(245,158,11,0.18)'}
                  onMouseLeave={e => e.target.style.background = 'rgba(245,158,11,0.08)'}
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          </div>

          {/* CGPA badge */}
          <div style={{
            background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: 12, padding: '16px 20px', textAlign: 'center', flexShrink: 0,
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>
              {p.basic.cgpa.split(' / ')[0]}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>CGPA / 4.00</div>
          </div>
        </div>
      </div>

      {/* ── Stats grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {p.stats.map(s => (
          <div key={s.id} className="card" style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: s.value.length > 5 ? 20 : 28,
              fontWeight: 800, color: s.color, lineHeight: 1,
            }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}