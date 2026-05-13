import { useState } from 'react'
import { profile } from '../data/profile'

/* ─── Level badge ─────────────────────────────────────── */
const LEVEL_META = {
  Expert:       { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
  Advanced:     { bg: 'rgba(52,211,153,0.12)',  color: '#34d399', border: 'rgba(52,211,153,0.3)' },
  Proficient:   { bg: 'rgba(129,140,248,0.12)', color: '#818cf8', border: 'rgba(129,140,248,0.3)' },
  Intermediate: { bg: 'rgba(56,189,248,0.12)',  color: '#38bdf8', border: 'rgba(56,189,248,0.3)' },
  Familiar:     { bg: 'rgba(139,151,184,0.12)', color: '#8b97b8', border: 'rgba(139,151,184,0.25)' },
}

function LevelBadge({ level }) {
  const m = LEVEL_META[level] || LEVEL_META.Familiar
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: '2px 7px',
      borderRadius: 9999, border: `1px solid ${m.border}`,
      background: m.bg, color: m.color, fontFamily: 'var(--font-display)',
      letterSpacing: '0.04em', flexShrink: 0,
    }}>{level}</span>
  )
}

/* ─── Status pill ─────────────────────────────────────── */
function StatusPill({ text, color }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: '3px 10px',
      borderRadius: 9999, background: `${color}18`,
      border: `1px solid ${color}40`, color,
      fontFamily: 'var(--font-display)', letterSpacing: '0.04em',
    }}>{text}</span>
  )
}

/* ─── Section header ──────────────────────────────────── */
function SectionHeader({ icon, title, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800,
          color: 'var(--text-primary)', margin: 0, lineHeight: 1.2,
        }}>{title}</h2>
        {sub && <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{sub}</p>}
      </div>
    </div>
  )
}

/* ─── Section wrapper ─────────────────────────────────── */
function Section({ children, style = {} }) {
  return (
    <div className="card" style={{ ...style }}>{children}</div>
  )
}

/* ─── Tab bar ─────────────────────────────────────────── */
const TABS = [
  { id: 'overview',  label: 'Overview',    icon: '🧑‍💻' },
  { id: 'projects',  label: 'Projects',    icon: '🚀' },
  { id: 'skills',    label: 'Skills',      icon: '⚙️' },
  { id: 'career',    label: 'Career',      icon: '📋' },
  { id: 'more',      label: 'More',        icon: '✨' },
]

/* ════════════════════════════════════════════════════════
   MAIN PROFILE PAGE
════════════════════════════════════════════════════════ */
export default function Profile() {
  const [activeTab, setActiveTab] = useState('overview')
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

      {/* ── Tab nav ── */}
      <div style={{
        display: 'flex', gap: 4, borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: 0, overflowX: 'auto',
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 18px', border: 'none', borderBottom: `2px solid ${activeTab === t.id ? 'var(--accent)' : 'transparent'}`,
              background: 'transparent', color: activeTab === t.id ? 'var(--accent)' : 'var(--text-muted)',
              fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
              marginBottom: -1,
            }}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* ══════════ TAB: OVERVIEW ══════════ */}
      {activeTab === 'overview' && (
        <>
          {/* Bio */}
          <Section>
            <SectionHeader icon="🧑‍💻" title="About Me" />
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>
              {p.bio}
            </p>
          </Section>

          {/* Specializations */}
          <Section>
            <SectionHeader icon="🎯" title="Specializations" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
              {p.specializations.map(s => (
                <div key={s.label} style={{
                  background: 'var(--bg)', border: '1px solid var(--border-subtle)',
                  borderRadius: 8, padding: '14px 16px',
                }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </Section>

          {/* Interests */}
          <Section>
            <SectionHeader icon="✨" title="Areas of Interest" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {p.interests.map(i => (
                <span key={i.label} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'var(--bg)', border: '1px solid var(--border-subtle)',
                  borderRadius: 9999, padding: '7px 16px',
                  fontSize: 13, color: 'var(--text-secondary)',
                }}>
                  <span>{i.icon}</span> {i.label}
                </span>
              ))}
            </div>
          </Section>

          {/* Philosophy */}
          <Section style={{ borderColor: 'rgba(245,158,11,0.25)' }}>
            <SectionHeader icon="💡" title="Engineering Philosophy" />
            <blockquote style={{
              fontSize: 15, fontWeight: 600, color: 'var(--accent)',
              fontFamily: 'var(--font-display)', lineHeight: 1.5,
              borderLeft: '3px solid var(--accent)', paddingLeft: 16, margin: '0 0 20px',
              fontStyle: 'italic',
            }}>
              {p.philosophy.quote}
            </blockquote>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
              {p.philosophy.principles.map(pr => (
                <div key={pr.label} style={{
                  background: 'var(--bg)', border: '1px solid var(--border-subtle)',
                  borderRadius: 8, padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-start',
                }}>
                  <span style={{ fontSize: 18 }}>{pr.icon}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{pr.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{pr.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </>
      )}

      {/* ══════════ TAB: PROJECTS ══════════ */}
      {activeTab === 'projects' && (
        <>
          {/* Current projects */}
          <Section>
            <SectionHeader icon="🚀" title="Current Projects" sub="Active & in production" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {p.currentProjects.map(proj => (
                <div key={proj.id} style={{
                  background: 'var(--bg)', border: '1px solid var(--border-subtle)',
                  borderRadius: 10, overflow: 'hidden',
                  ...(proj.featured ? { borderColor: 'rgba(245,158,11,0.2)' } : {}),
                }}>
                  {/* Color bar */}
                  <div style={{ height: 3, background: proj.statusColor, opacity: 0.6 }} />
                  <div style={{ padding: '16px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 24 }}>{proj.icon}</span>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>
                              {proj.name}
                            </span>
                            <StatusPill text={proj.status} color={proj.statusColor} />
                            {proj.featured && (
                              <span style={{
                                fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 9999,
                                background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)',
                                color: 'var(--accent)', fontFamily: 'var(--font-display)',
                              }}>Featured</span>
                            )}
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{proj.tagline}</div>
                        </div>
                      </div>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noreferrer" className="job-apply-link">
                          View ↗
                        </a>
                      )}
                    </div>

                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: '12px 0 12px' }}>
                      {proj.description}
                    </p>

                    {proj.highlights.length > 0 && (
                      <ul style={{ margin: '0 0 12px', padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {proj.highlights.map(h => (
                          <li key={h} style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{h}</li>
                        ))}
                      </ul>
                    )}

                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {proj.stack.map(tech => (
                        <span key={tech} className="job-chip">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Featured engineering work */}
          <Section>
            <SectionHeader icon="⚡" title="Featured Engineering Work" sub="Deep technical contributions" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {p.featuredWork.map(fw => (
                <div key={fw.id} style={{
                  background: 'var(--bg)', border: '1px solid var(--border-subtle)',
                  borderRadius: 10, padding: '16px 18px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontSize: 22 }}>{fw.icon}</span>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>
                          {fw.name}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{fw.subtitle}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{fw.year}</span>
                      {fw.link && (
                        <a href={fw.link} target="_blank" rel="noreferrer" className="job-apply-link" style={{ fontSize: 11 }}>
                          GitHub ↗
                        </a>
                      )}
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 10px' }}>
                    {fw.description}
                  </p>
                  <ul style={{ margin: '0 0 12px', padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {fw.bullets.map(b => (
                      <li key={b} style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{b}</li>
                    ))}
                  </ul>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {fw.tags.map(tag => (
                      <span key={tag} style={{
                        fontSize: 11, padding: '3px 9px', borderRadius: 6,
                        background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                        color: 'var(--text-muted)',
                      }}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Past projects */}
          <Section>
            <SectionHeader icon="📦" title="Past Projects" sub="Notable earlier work" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
              {p.pastProjects.map(pp => (
                <div key={pp.id} style={{
                  background: 'var(--bg)', border: '1px solid var(--border-subtle)',
                  borderRadius: 8, padding: '14px 16px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 18 }}>{pp.icon}</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {pp.name}
                      </span>
                    </div>
                    {pp.link && (
                      <a href={pp.link} target="_blank" rel="noreferrer"
                        style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                        ↗
                      </a>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 8px' }}>{pp.desc}</p>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {pp.tags.map(t => (
                      <span key={t} style={{
                        fontSize: 10, padding: '2px 7px', borderRadius: 4,
                        background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                        color: 'var(--text-muted)',
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </>
      )}

      {/* ══════════ TAB: SKILLS ══════════ */}
      {activeTab === 'skills' && (
        <>
          {p.techStack.map(cat => (
            <Section key={cat.category}>
              <SectionHeader icon={cat.icon} title={cat.category} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cat.items.map(item => (
                  <div key={item.name} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px', background: 'var(--bg)',
                    border: '1px solid var(--border-subtle)', borderRadius: 8,
                  }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                      background: item.color, opacity: 0.85,
                    }} />
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>
                      {item.name}
                    </span>
                    <LevelBadge level={item.level} />
                  </div>
                ))}
              </div>
            </Section>
          ))}
        </>
      )}

      {/* ══════════ TAB: CAREER ══════════ */}
      {activeTab === 'career' && (
        <>
          {/* Experience */}
          <Section>
            <SectionHeader icon="💼" title="Experience" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {p.experience.map((exp, i) => (
                <div key={exp.id} style={{
                  display: 'flex', gap: 16,
                }}>
                  {/* Timeline */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{
                      width: 12, height: 12, borderRadius: '50%', marginTop: 4, flexShrink: 0,
                      background: exp.current ? 'var(--accent)' : 'var(--text-muted)',
                      border: `2px solid ${exp.current ? 'rgba(245,158,11,0.3)' : 'var(--border)'}`,
                    }} />
                    {i < p.experience.length - 1 && (
                      <div style={{ width: 1, flex: 1, background: 'var(--border-subtle)', marginTop: 6 }} />
                    )}
                  </div>

                  <div style={{ flex: 1, paddingBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, marginBottom: 4 }}>
                      <div>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>
                          {exp.role}
                        </span>
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginLeft: 6 }}>
                          @ {exp.companyUrl
                            ? <a href={exp.companyUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>{exp.company}</a>
                            : exp.company}
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{exp.period}</span>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontStyle: 'italic' }}>{exp.type}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: '6px 0 10px' }}>
                      {exp.description}
                    </p>
                    <ul style={{ margin: '0 0 10px', padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {exp.highlights.map(h => (
                        <li key={h} style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{h}</li>
                      ))}
                    </ul>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {exp.stack.map(t => (
                        <span key={t} className="job-chip">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Education */}
          <Section>
            <SectionHeader icon="🎓" title="Education" />
            {p.education.map(edu => (
              <div key={edu.id} style={{
                background: 'var(--bg)', border: '1px solid var(--border-subtle)',
                borderRadius: 10, padding: '18px 20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>
                      {edu.degree}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{edu.institution}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{edu.period}</div>
                  </div>
                  <div style={{
                    background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)',
                    borderRadius: 8, padding: '10px 16px', textAlign: 'center', flexShrink: 0,
                  }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>
                      {edu.cgpa.split(' / ')[0]}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>CGPA / 4.00</div>
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                    Coursework
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {edu.coursework.map(c => (
                      <span key={c} style={{
                        fontSize: 11, padding: '3px 9px', borderRadius: 6,
                        background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                        color: 'var(--text-muted)',
                      }}>{c}</span>
                    ))}
                  </div>
                </div>

                <ul style={{ margin: 0, padding: '0 0 0 18px' }}>
                  {edu.highlights.map(h => (
                    <li key={h} style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>
        </>
      )}

      {/* ══════════ TAB: MORE ══════════ */}
      {activeTab === 'more' && (
        <>
          {/* Achievements */}
          <Section>
            <SectionHeader icon="🏆" title="Honors & Achievements" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {p.achievements.map(ach => (
                <div key={ach.id} style={{
                  display: 'flex', gap: 14, alignItems: 'flex-start',
                  background: 'var(--bg)', border: '1px solid var(--border-subtle)',
                  borderRadius: 10, padding: '14px 16px',
                  borderLeft: `3px solid ${ach.color}`,
                }}>
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{ach.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>
                          {ach.title}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1 }}>{ach.event}</div>
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{ach.year}</span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, margin: '8px 0 0' }}>
                      {ach.description}
                    </p>
                    {ach.link && (
                      <a href={ach.link} target="_blank" rel="noreferrer"
                        style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, fontFamily: 'var(--font-display)', textDecoration: 'none', display: 'inline-block', marginTop: 6 }}>
                        View project ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Open Source */}
          <Section>
            <SectionHeader icon="🌍" title="Open Source" />
            {p.openSource.map(os => (
              <div key={os.name} style={{
                background: 'var(--bg)', border: '1px solid var(--border-subtle)',
                borderRadius: 10, padding: '16px 18px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: 22 }}>{os.icon}</span>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{os.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>{os.role}</div>
                    </div>
                  </div>
                  <a href={os.link} target="_blank" rel="noreferrer" className="job-apply-link">View ↗</a>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: '10px 0 0' }}>
                  {os.description}
                </p>
              </div>
            ))}
          </Section>

          {/* Engineering foundations */}
          <Section>
            <SectionHeader icon="⚔️" title="Engineering Foundations" sub="Daily practice & systems thinking" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
              {[
                { name: 'LeetCode DSA', desc: 'Daily interview prep — core data structures, algorithms, patterns', icon: '🧠', link: 'https://github.com/shahjalal-mahmud/LeetCode' },
                { name: 'CodeForces', desc: 'C++ competitive programming — difficulty 800–1000+', icon: '⚔️', link: 'https://github.com/shahjalal-mahmud/CodeForces' },
                { name: 'Data Structures', desc: 'Built from scratch: Lists, Stacks, Queues, Trees, Graphs', icon: '🗂️', link: 'https://github.com/shahjalal-mahmud/data-structures-from-scratch' },
                { name: 'Algorithm Impls', desc: 'DP, graph algorithms, sorting, shortest path, traversal', icon: '📐', link: 'https://github.com/shahjalal-mahmud/algorithm-implementations' },
              ].map(f => (
                <a key={f.name} href={f.link} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'var(--bg)', border: '1px solid var(--border-subtle)',
                    borderRadius: 8, padding: '14px 16px', cursor: 'pointer',
                    transition: 'border-color 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.25)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                  >
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{f.icon}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{f.name} ↗</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                </a>
              ))}
            </div>
          </Section>

          {/* Fun facts */}
          <Section style={{ borderColor: 'rgba(245,158,11,0.15)' }}>
            <SectionHeader icon="☕" title="Random Facts" />
            <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {p.philosophy.funFacts.map(f => (
                <li key={f} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f}</li>
              ))}
            </ul>
          </Section>
        </>
      )}
    </div>
  )
}