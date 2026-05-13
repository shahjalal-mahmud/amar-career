import { useState, useEffect } from 'react'
import { profile } from '../data/profile'

/* ════════════════════════════════════════════════════════
   MARKDOWN RENDERER  (no external deps – pure regex parse)
════════════════════════════════════════════════════════ */
function renderMarkdown(md) {
  if (!md) return ''

  const escape = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // fenced code blocks
  md = md.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) =>
    `<pre class="md-pre"><code class="md-code${lang ? ` language-${lang}` : ''}">${escape(code.trimEnd())}</code></pre>`)

  // inline code
  md = md.replace(/`([^`]+)`/g, (_, c) => `<code class="md-inline-code">${escape(c)}</code>`)

  // headings
  md = md.replace(/^#{6}\s(.+)$/gm, '<h6 class="md-h6">$1</h6>')
  md = md.replace(/^#{5}\s(.+)$/gm, '<h5 class="md-h5">$1</h5>')
  md = md.replace(/^#{4}\s(.+)$/gm, '<h4 class="md-h4">$1</h4>')
  md = md.replace(/^#{3}\s(.+)$/gm, '<h3 class="md-h3">$1</h3>')
  md = md.replace(/^#{2}\s(.+)$/gm, '<h2 class="md-h2">$1</h2>')
  md = md.replace(/^#{1}\s(.+)$/gm, '<h1 class="md-h1">$1</h1>')

  // horizontal rule
  md = md.replace(/^---$/gm, '<hr class="md-hr" />')

  // blockquote
  md = md.replace(/^>\s(.+)$/gm, '<blockquote class="md-blockquote">$1</blockquote>')

  // bold + italic
  md = md.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  md = md.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  md = md.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // strikethrough
  md = md.replace(/~~(.+?)~~/g, '<del>$1</del>')

  // links
  md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noreferrer" class="md-link">$1</a>')

  // images
  md = md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img alt="$1" src="$2" class="md-img" />')

  // task lists (before ul)
  md = md.replace(/^- \[x\] (.+)$/gm, '<li class="md-task done">✅ $1</li>')
  md = md.replace(/^- \[ \] (.+)$/gm, '<li class="md-task">⬜ $1</li>')

  // unordered list items
  md = md.replace(/^[-*] (.+)$/gm, '<li class="md-li">$1</li>')

  // ordered list items
  md = md.replace(/^\d+\. (.+)$/gm, '<li class="md-oli">$1</li>')

  // wrap consecutive li groups
  md = md.replace(/((<li class="md-li">.*<\/li>\n?)+)/g, '<ul class="md-ul">$1</ul>')
  md = md.replace(/((<li class="md-oli">.*<\/li>\n?)+)/g, '<ol class="md-ol">$1</ol>')
  md = md.replace(/((<li class="md-task.*?">.*<\/li>\n?)+)/g, '<ul class="md-ul md-tasklist">$1</ul>')

  // tables
  md = md.replace(
    /^\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n?)+)/gm,
    (_, header, rows) => {
      const th = header.split('|').filter(Boolean).map(c =>
        `<th class="md-th">${c.trim()}</th>`).join('')
      const trs = rows.trim().split('\n').map(row => {
        const tds = row.split('|').filter(Boolean).map(c =>
          `<td class="md-td">${c.trim()}</td>`).join('')
        return `<tr>${tds}</tr>`
      }).join('')
      return `<div class="md-table-wrap"><table class="md-table"><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table></div>`
    }
  )

  // paragraphs (double newline)
  md = md.replace(/\n\n(?!<)/g, '</p><p class="md-p">')
  md = `<p class="md-p">${md}</p>`

  // clean empty <p>
  md = md.replace(/<p class="md-p"><\/p>/g, '')
  md = md.replace(/<p class="md-p">(<(?:h[1-6]|ul|ol|pre|hr|blockquote|div|table))/g, '$1')
  md = md.replace(/(<\/(?:h[1-6]|ul|ol|pre|hr|blockquote|div|table)>)<\/p>/g, '$1')

  return md
}

/* ════════════════════════════════════════════════════════
   MARKDOWN VIEWER COMPONENT
════════════════════════════════════════════════════════ */
function MarkdownViewer({ filePath = 'docs/profile.md' }) {
  const [markdown, setMarkdown] = useState('')
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [copied, setCopied]     = useState(false)
  const [view, setView]         = useState('preview') // 'preview' | 'raw'

  useEffect(() => {
    setLoading(true)
    fetch(`/${filePath}`)
      .then(r => {
        if (!r.ok) throw new Error(`${r.status} – ${r.statusText}`)
        return r.text()
      })
      .then(text => { setMarkdown(text); setLoading(false) })
      .catch(err  => { setError(err.message); setLoading(false) })
  }, [filePath])

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="card" style={{ marginTop: 20, padding: 0, overflow: 'hidden' }}>
      {/* ── Toolbar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(255,255,255,0.03)',
        flexWrap: 'wrap', gap: 8,
      }}>
        {/* left: file pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>📄</span>
          <span style={{
            fontFamily: 'monospace', fontSize: 13, fontWeight: 600,
            color: 'var(--text-primary)',
          }}>{filePath}</span>
        </div>

        {/* right: controls */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Preview / Raw toggle */}
          <div style={{
            display: 'flex', borderRadius: 8,
            border: '1px solid var(--border)', overflow: 'hidden',
          }}>
            {['preview', 'raw'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: '5px 14px', fontSize: 12, fontWeight: 600, border: 'none',
                  cursor: 'pointer', fontFamily: 'var(--font-display)',
                  background: view === v ? 'rgba(245,158,11,0.15)' : 'transparent',
                  color: view === v ? 'var(--accent)' : 'var(--text-muted)',
                  transition: 'all 0.15s',
                }}
              >{v.charAt(0).toUpperCase() + v.slice(1)}</button>
            ))}
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            disabled={loading || !!error}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 14px', fontSize: 12, fontWeight: 600,
              borderRadius: 8, border: '1px solid var(--border)',
              cursor: 'pointer', fontFamily: 'var(--font-display)',
              background: copied ? 'rgba(52,211,153,0.12)' : 'transparent',
              color: copied ? '#34d399' : 'var(--text-secondary)',
              transition: 'all 0.2s',
            }}
          >
            {copied ? '✓ Copied!' : '⎘ Copy'}
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '28px 32px', maxWidth: '100%', overflowX: 'auto' }}>
        {loading && (
          <div style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', padding: '40px 0' }}>
            Loading {filePath}…
          </div>
        )}

        {error && (
          <div style={{
            color: '#f87171', background: 'rgba(248,113,113,0.08)',
            border: '1px solid rgba(248,113,113,0.2)',
            borderRadius: 8, padding: '14px 18px', fontSize: 13,
          }}>
            ⚠ Could not load <code>{filePath}</code>: {error}
          </div>
        )}

        {!loading && !error && view === 'raw' && (
          <pre style={{
            fontFamily: 'monospace', fontSize: 13, lineHeight: 1.7,
            color: 'var(--text-secondary)', whiteSpace: 'pre-wrap',
            wordBreak: 'break-word', margin: 0,
          }}>{markdown}</pre>
        )}

        {!loading && !error && view === 'preview' && (
          <div
            className="md-body"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
          />
        )}
      </div>

      {/* Inline styles for markdown elements */}
      <style>{`
        .md-body { color: var(--text-primary); font-size: 15px; line-height: 1.75; }
        .md-h1 { font-family: var(--font-display); font-size: 2em; font-weight: 800; border-bottom: 2px solid var(--border); padding-bottom: 10px; margin: 28px 0 16px; color: var(--text-primary); }
        .md-h2 { font-family: var(--font-display); font-size: 1.5em; font-weight: 700; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin: 24px 0 14px; color: var(--text-primary); }
        .md-h3 { font-family: var(--font-display); font-size: 1.25em; font-weight: 700; margin: 20px 0 10px; color: var(--text-primary); }
        .md-h4,.md-h5,.md-h6 { font-family: var(--font-display); font-weight: 600; margin: 16px 0 8px; color: var(--text-primary); }
        .md-h4 { font-size: 1.1em; }
        .md-h5,.md-h6 { font-size: 1em; }
        .md-p { margin: 0 0 14px; color: var(--text-secondary); }
        .md-p:last-child { margin-bottom: 0; }
        .md-hr { border: none; border-top: 1px solid var(--border); margin: 24px 0; }
        .md-blockquote { margin: 16px 0; padding: 10px 18px; border-left: 4px solid var(--accent); background: rgba(245,158,11,0.06); border-radius: 0 8px 8px 0; color: var(--text-secondary); font-style: italic; }
        .md-ul,.md-ol { padding-left: 24px; margin: 10px 0 14px; }
        .md-li,.md-oli { margin-bottom: 6px; color: var(--text-secondary); }
        .md-task { list-style: none; margin-left: -8px; }
        .md-link { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
        .md-link:hover { opacity: 0.8; }
        .md-img { max-width: 100%; border-radius: 8px; margin: 12px 0; }
        .md-pre { background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 10px; padding: 18px 20px; overflow-x: auto; margin: 16px 0; }
        .md-code { font-family: monospace; font-size: 13px; color: #e2e8f0; line-height: 1.6; }
        .md-inline-code { font-family: monospace; font-size: 13px; background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2); color: var(--accent); border-radius: 4px; padding: 1px 6px; }
        .md-table-wrap { overflow-x: auto; margin: 16px 0; }
        .md-table { border-collapse: collapse; width: 100%; font-size: 14px; }
        .md-th { background: rgba(245,158,11,0.08); color: var(--text-primary); font-weight: 700; font-family: var(--font-display); padding: 10px 16px; border: 1px solid var(--border); text-align: left; }
        .md-td { padding: 9px 16px; border: 1px solid var(--border); color: var(--text-secondary); }
        .md-table tr:hover .md-td { background: rgba(255,255,255,0.03); }
      `}</style>
    </div>
  )
}

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

      {/* ── Profile Markdown Document ── */}
      <MarkdownViewer filePath="docs/profile.md" />
    </div>
  )
}