import { useState, useMemo } from 'react'
import { useProfile } from '../hooks/useProfile'
import { seedProfileToFirestore } from '../utils/migrateProfile'
import { db } from '../firebase'

/* ── Sections enum (display order) per project.md §4.4 ── */
const SECTION_DEFS = [
  { id: 'Personal Info',  icon: '👤' },
  { id: 'Skills',         icon: '🧠' },
  { id: 'Experience',     icon: '💼' },
  { id: 'Education',      icon: '🎓' },
  { id: 'Projects',       icon: '🚀' },
  { id: 'Certifications', icon: '📜' },
  { id: 'Achievements',   icon: '🏆' },
]
const SECTION_IDS = SECTION_DEFS.map((s) => s.id)

/* ─────────────────────────────────────────────────────────────────────
   Markdown renderer (kept identical to the project.md §3 regex renderer)
   ───────────────────────────────────────────────────────────────────── */
function renderMarkdown(md) {
  if (!md) return ''
  const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  md = md.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) =>
    `<pre class="md-pre"><code class="md-code${lang ? ` language-${lang}` : ''}">${escape(code.trimEnd())}</code></pre>`
  )
  md = md.replace(/`([^`]+)`/g, (_, c) => `<code class="md-inline-code">${escape(c)}</code>`)
  md = md.replace(/^#{6}\s(.+)$/gm, '<h6 class="md-h6">$1</h6>')
  md = md.replace(/^#{5}\s(.+)$/gm, '<h5 class="md-h5">$1</h5>')
  md = md.replace(/^#{4}\s(.+)$/gm, '<h4 class="md-h4">$1</h4>')
  md = md.replace(/^#{3}\s(.+)$/gm, '<h3 class="md-h3">$1</h3>')
  md = md.replace(/^#{2}\s(.+)$/gm, '<h2 class="md-h2">$1</h2>')
  md = md.replace(/^#{1}\s(.+)$/gm, '<h1 class="md-h1">$1</h1>')
  md = md.replace(/^---$/gm, '<hr class="md-hr" />')
  md = md.replace(/^>\s(.+)$/gm, '<blockquote class="md-blockquote">$1</blockquote>')
  md = md.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  md = md.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  md = md.replace(/\*(.+?)\*/g, '<em>$1</em>')
  md = md.replace(/~~(.+?)~~/g, '<del>$1</del>')
  md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noreferrer" class="md-link">$1</a>')
  md = md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img alt="$1" src="$2" class="md-img" />')
  md = md.replace(/^- \[x\] (.+)$/gm, '<li class="md-task done">✅ $1</li>')
  md = md.replace(/^- \[ \] (.+)$/gm, '<li class="md-task">⬜ $1</li>')
  md = md.replace(/^[-*] (.+)$/gm, '<li class="md-li">$1</li>')
  md = md.replace(/^\d+\. (.+)$/gm, '<li class="md-oli">$1</li>')
  md = md.replace(/((<li class="md-li">.*<\/li>\n?)+)/g, '<ul class="md-ul">$1</ul>')
  md = md.replace(/((<li class="md-oli">.*<\/li>\n?)+)/g, '<ol class="md-ol">$1</ol>')
  md = md.replace(/((<li class="md-task.*?">.*<\/li>\n?)+)/g, '<ul class="md-ul md-tasklist">$1</ul>')
  md = md.replace(/^\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n?)+)/gm,
    (_, header, rows) => {
      const th = header.split('|').filter(Boolean).map((c) => `<th class="md-th">${c.trim()}</th>`).join('')
      const trs = rows.trim().split('\n').map((row) => {
        const tds = row.split('|').filter(Boolean).map((c) => `<td class="md-td">${c.trim()}</td>`).join('')
        return `<tr>${tds}</tr>`
      }).join('')
      return `<div class="md-table-wrap"><table class="md-table"><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table></div>`
    }
  )
  md = md.replace(/\n\n(?!<)/g, '</p><p class="md-p">')
  md = `<p class="md-p">${md}</p>`
  md = md.replace(/<p class="md-p"><\/p>/g, '')
  md = md.replace(/<p class="md-p">(<(?:h[1-6]|ul|ol|pre|hr|blockquote|div|table))/g, '$1')
  md = md.replace(/(<\/(?:h[1-6]|ul|ol|pre|hr|blockquote|div|table)>)<\/p>/g, '$1')
  return md
}

/* ─────────────────────────────────────────────────────────────────────
   MarkdownViewer — takes markdown directly (no more fetch).
   Inline styles match the existing block styles in index.css.
   ───────────────────────────────────────────────────────────────────── */
function MarkdownViewer({ markdown = '', label }) {
  const [copied, setCopied] = useState(false)
  const [view, setView]     = useState('preview') // 'preview' | 'raw'

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div>
      {/* toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 14px',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(255,255,255,0.03)',
        flexWrap: 'wrap', gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {label && <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{label}</span>}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{
            display: 'flex', borderRadius: 8,
            border: '1px solid var(--border)', overflow: 'hidden',
          }}>
            {['preview', 'raw'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: '4px 12px', fontSize: 11, fontWeight: 600, border: 'none',
                  cursor: 'pointer', fontFamily: 'var(--font-display)',
                  background: view === v ? 'rgba(245,158,11,0.15)' : 'transparent',
                  color: view === v ? 'var(--accent)' : 'var(--text-muted)',
                  transition: 'all 0.15s',
                }}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={handleCopy}
            disabled={!markdown}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '4px 12px', fontSize: 11, fontWeight: 600,
              borderRadius: 8, border: '1px solid var(--border)',
              cursor: markdown ? 'pointer' : 'not-allowed',
              opacity: markdown ? 1 : 0.5,
              fontFamily: 'var(--font-display)',
              background: copied ? 'rgba(52,211,153,0.12)' : 'transparent',
              color: copied ? '#34d399' : 'var(--text-secondary)',
              transition: 'all 0.2s',
            }}
          >
            {copied ? '✓ Copied!' : '⎘ Copy'}
          </button>
        </div>
      </div>

      {/* body */}
      <div style={{ padding: '18px 22px', maxWidth: '100%', overflowX: 'auto' }}>
        {!markdown && (
          <p style={{ color: 'var(--text-muted)', fontSize: 13, fontStyle: 'italic' }}>
            No content yet.
          </p>
        )}
        {markdown && view === 'raw' && (
          <pre style={{
            fontFamily: 'monospace', fontSize: 13, lineHeight: 1.7,
            color: 'var(--text-secondary)', whiteSpace: 'pre-wrap',
            wordBreak: 'break-word', margin: 0,
          }}>{markdown}</pre>
        )}
        {markdown && view === 'preview' && (
          <div
            className="md-body"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
          />
        )}
      </div>

      <style>{`
        .md-body { color: var(--text-primary); font-size: 14px; line-height: 1.7; }
        .md-h1 { font-family: var(--font-display); font-size: 1.7em; font-weight: 800; border-bottom: 2px solid var(--border); padding-bottom: 8px; margin: 22px 0 12px; color: var(--text-primary); }
        .md-h2 { font-family: var(--font-display); font-size: 1.35em; font-weight: 700; border-bottom: 1px solid var(--border); padding-bottom: 6px; margin: 20px 0 12px; color: var(--text-primary); }
        .md-h3 { font-family: var(--font-display); font-size: 1.15em; font-weight: 700; margin: 16px 0 8px; color: var(--text-primary); }
        .md-h4,.md-h5,.md-h6 { font-family: var(--font-display); font-weight: 600; margin: 12px 0 6px; color: var(--text-primary); }
        .md-h4 { font-size: 1.05em; }
        .md-h5,.md-h6 { font-size: 1em; }
        .md-p { margin: 0 0 10px; color: var(--text-secondary); }
        .md-p:last-child { margin-bottom: 0; }
        .md-hr { border: none; border-top: 1px solid var(--border); margin: 18px 0; }
        .md-blockquote { margin: 12px 0; padding: 8px 14px; border-left: 4px solid var(--accent); background: rgba(245,158,11,0.06); border-radius: 0 6px 6px 0; color: var(--text-secondary); font-style: italic; }
        .md-ul,.md-ol { padding-left: 22px; margin: 8px 0 10px; }
        .md-li,.md-oli { margin-bottom: 4px; color: var(--text-secondary); }
        .md-task { list-style: none; margin-left: -6px; }
        .md-link { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
        .md-link:hover { opacity: 0.8; }
        .md-img { max-width: 100%; border-radius: 6px; margin: 10px 0; }
        .md-pre { background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 8px; padding: 12px 14px; overflow-x: auto; margin: 12px 0; }
        .md-code { font-family: monospace; font-size: 12px; color: #e2e8f0; line-height: 1.6; }
        .md-inline-code { font-family: monospace; font-size: 12px; background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2); color: var(--accent); border-radius: 4px; padding: 1px 5px; }
        .md-table-wrap { overflow-x: auto; margin: 12px 0; }
        .md-table { border-collapse: collapse; width: 100%; font-size: 13px; }
        .md-th { background: rgba(245,158,11,0.08); color: var(--text-primary); font-weight: 700; font-family: var(--font-display); padding: 8px 12px; border: 1px solid var(--border); text-align: left; }
        .md-td { padding: 7px 12px; border: 1px solid var(--border); color: var(--text-secondary); }
      `}</style>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   Field/Input/Select primitives (consistent with JobForm/Notes)
   ───────────────────────────────────────────────────────────────────── */
function Field({ label, required, error, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        fontSize: '12px', fontWeight: '600', letterSpacing: '0.06em',
        textTransform: 'uppercase', color: 'var(--label-color)',
        display: 'flex', alignItems: 'center', gap: '6px',
      }}>
        {label}
        {required && <span style={{ color: '#f87171', fontSize: '10px' }}>REQUIRED</span>}
        {hint && <span style={{ fontSize: '11px', fontWeight: '400', textTransform: 'none', letterSpacing: 0, color: 'var(--hint-color)', marginLeft: 'auto' }}>{hint}</span>}
      </label>
      {children}
      {error && <span style={{ fontSize: '11px', color: '#f87171', display: 'flex', alignItems: 'center', gap: '4px' }}>⚠ {error}</span>}
    </div>
  )
}

const inputStyle = (hasError) => ({
  width: '100%',
  padding: '10px 14px',
  background: 'var(--input-bg)',
  border: `1.5px solid ${hasError ? '#f87171' : 'var(--input-border)'}`,
  borderRadius: '10px',
  color: 'var(--text-primary)',
  fontSize: '14px',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
})

function Input({ value, onChange, placeholder, error, type = 'text' }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      style={{
        ...inputStyle(error),
        borderColor: focused ? 'var(--accent)' : (error ? '#f87171' : 'var(--input-border)'),
        boxShadow: focused ? '0 0 0 3px var(--accent-glow)' : 'none',
      }}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  )
}

function Select({ value, onChange, options, error }) {
  const [focused, setFocused] = useState(false)
  return (
    <select
      style={{
        ...inputStyle(error),
        borderColor: focused ? 'var(--accent)' : (error ? '#f87171' : 'var(--input-border)'),
        boxShadow: focused ? '0 0 0 3px var(--accent-glow)' : 'none',
        cursor: 'pointer', appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        backgroundSize: '16px',
        paddingRight: '36px',
      }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   Modal shell (close-on-overlay-click + Esc)
   ───────────────────────────────────────────────────────────────────── */
function Modal({ children, onClose, maxWidth = 640 }) {
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, animation: 'pmod-in 0.15s ease',
      }}
    >
      <div
        style={{
          background: '#111827',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 18,
          width: '100%', maxWidth,
          maxHeight: '92vh',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
          animation: 'pmod-up 0.2s cubic-bezier(0.16,1,0.3,1)',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
      <style>{`
        @keyframes pmod-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes pmod-up { from { opacity: 0; transform: translateY(20px) scale(0.98) } to { opacity: 1; transform: none } }
        @keyframes p-spin { to { transform: rotate(360deg) } }
      `}</style>
    </div>
  )
}

function ModalHeader({ title, subtitle, onClose }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 24px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)',
      flexShrink: 0,
    }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--hint-color)' }}>{subtitle}</p>
        )}
      </div>
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          width: 32, height: 32, borderRadius: 8,
          border: '1px solid var(--input-border)',
          background: 'transparent', color: 'var(--label-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0,
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   HeroForm — edit modal for profile/main
   ───────────────────────────────────────────────────────────────────── */
function HeroForm({ initial, onSave, onCancel, isSaving }) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    title: initial?.title ?? '',
    location: initial?.location ?? '',
    avatarInitials: initial?.avatarInitials ?? '',
    links: Array.isArray(initial?.links) && initial.links.length
      ? initial.links.map((l) => ({ label: l.label ?? '', url: l.url ?? '' }))
      : [{ label: '', url: '' }],
  })
  const [errors, setErrors] = useState({})

  const set = (key) => (val) => setForm((p) => ({ ...p, [key]: val }))
  const setLink = (i, key) => (val) =>
    setForm((p) => ({ ...p, links: p.links.map((l, idx) => (idx === i ? { ...l, [key]: val } : l)) }))

  const addLink = () => setForm((p) => ({ ...p, links: [...p.links, { label: '', url: '' }] }))
  const removeLink = (i) => setForm((p) => ({ ...p, links: p.links.filter((_, idx) => idx !== i) }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.title.trim()) e.title = 'Title is required'
    const cleanLinks = form.links.filter((l) => l.label.trim() || l.url.trim())
    cleanLinks.forEach((l, i) => {
      if (l.label.trim() && !l.url.trim()) e[`links[${i}].url`] = 'URL required'
      if (l.url.trim() && !l.label.trim()) e[`links[${i}].label`] = 'Label required'
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    const links = form.links.filter((l) => l.label.trim() && l.url.trim())
    onSave({ ...form, links })
  }

  return (
    <Modal onClose={onCancel} maxWidth={580}>
      <ModalHeader title="Edit Hero" subtitle="Update your name, title, location, and links" onClose={onCancel} />

      <div style={{
        flex: 1, overflowY: 'auto', padding: 24,
        display: 'flex', flexDirection: 'column', gap: 18,
        scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
          <Field label="Name" required error={errors.name}>
            <Input value={form.name} onChange={set('name')} placeholder="e.g. Jane Doe" error={errors.name} />
          </Field>
          <Field label="Initials" hint="2 chars" error={errors.avatarInitials}>
            <Input value={form.avatarInitials} onChange={set('avatarInitials')} placeholder="JD" />
          </Field>
        </div>

        <Field label="Title" required error={errors.title}>
          <Input value={form.title} onChange={set('title')} placeholder="e.g. Backend Engineer" error={errors.title} />
        </Field>

        <Field label="Location">
          <Input value={form.location} onChange={set('location')} placeholder="e.g. Dhaka, Bangladesh" />
        </Field>

        <Field label="Links" hint="label + url">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {form.links.map((l, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: 8, alignItems: 'center' }}>
                <Input
                  value={l.label}
                  onChange={setLink(i, 'label')}
                  placeholder="Label"
                />
                <Input
                  value={l.url}
                  onChange={setLink(i, 'url')}
                  placeholder="https://…"
                />
                <button
                  type="button"
                  onClick={() => removeLink(i)}
                  disabled={form.links.length === 1}
                  style={{
                    width: 36, height: 36, borderRadius: 8,
                    border: '1px solid var(--input-border)', background: 'transparent',
                    color: 'var(--label-color)', cursor: form.links.length === 1 ? 'not-allowed' : 'pointer',
                    opacity: form.links.length === 1 ? 0.5 : 1,
                  }}
                  aria-label="Remove link"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addLink}
              style={{
                alignSelf: 'flex-start',
                padding: '6px 14px', borderRadius: 8,
                border: '1px dashed var(--input-border)',
                background: 'transparent', color: 'var(--label-color)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              + Add link
            </button>
          </div>
        </Field>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10,
        padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.07)',
        flexShrink: 0,
      }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '9px 18px', borderRadius: 9, border: '1px solid var(--input-border)',
            background: 'transparent', color: 'var(--label-color)',
            fontSize: 14, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
          }}
        >Cancel</button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          style={{
            padding: '9px 22px', borderRadius: 9, border: 'none',
            background: 'var(--accent)', color: '#fff',
            fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            opacity: isSaving ? 0.55 : 1,
            boxShadow: '0 2px 12px rgba(99,102,241,0.35)',
            display: 'flex', alignItems: 'center', gap: 7,
          }}
        >
          {isSaving
            ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'p-spin 0.7s linear infinite' }} />Saving…</>
            : '💾 Save'}
        </button>
      </div>
    </Modal>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   BlockForm — add/edit a profileBlock
   ───────────────────────────────────────────────────────────────────── */
function BlockEditor({ value, onChange }) {
  const [mode, setMode]       = useState('edit')
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px',
        background: 'var(--input-bg)',
        border: '1.5px solid var(--input-border)',
        borderBottom: 'none',
        borderRadius: '10px 10px 0 0',
      }}>
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--label-color)' }}>
          Content
          <span style={{ fontSize: 11, fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'var(--hint-color)', marginLeft: 8 }}>
            Markdown · headings, lists, links
          </span>
        </span>
        <div style={{ display: 'flex', gap: 2, background: 'rgba(0,0,0,0.2)', borderRadius: 7, padding: 2 }}>
          {['edit', 'preview'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              style={{
                padding: '4px 12px', borderRadius: 5, border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                background: mode === m ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: mode === m ? 'var(--text-primary)' : 'var(--hint-color)',
                boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
              }}
            >
              {m === 'edit' ? '✏ Edit' : '👁 Preview'}
            </button>
          ))}
        </div>
      </div>

      {mode === 'edit' ? (
        <textarea
          style={{
            ...inputStyle(false),
            borderRadius: '0 0 10px 10px',
            borderColor: focused ? 'var(--accent)' : 'var(--input-border)',
            boxShadow: focused ? '0 0 0 3px var(--accent-glow)' : 'none',
            resize: 'vertical', minHeight: '220px',
            fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
            fontSize: '13px', lineHeight: '1.7',
          }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={12}
          spellCheck={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="## Description\nWrite here…"
        />
      ) : (
        <div
          style={{
            ...inputStyle(false),
            borderRadius: '0 0 10px 10px',
            minHeight: '220px', lineHeight: '1.7', fontSize: '14px',
          }}
          className="md-body"
          dangerouslySetInnerHTML={{
            __html: renderMarkdown(value) || '<p style="color:var(--hint-color);font-style:italic">Nothing to preview yet.</p>',
          }}
        />
      )}
    </div>
  )
}

function BlockForm({ initial, defaultSection, onSave, onCancel, isSaving }) {
  const [form, setForm] = useState({
    section: initial?.section ?? defaultSection ?? SECTION_IDS[0],
    title:   initial?.title   ?? '',
    content: initial?.content ?? '',
  })
  const [errors, setErrors] = useState({})
  const set = (key) => (val) => setForm((p) => ({ ...p, [key]: val }))

  const validate = () => {
    const e = {}
    if (!SECTION_IDS.includes(form.section)) e.section = 'Pick a section'
    if (!form.title.trim())   e.title   = 'Title is required'
    if (!form.content.trim()) e.content = 'Content is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    onSave(form)
  }

  return (
    <Modal onClose={onCancel} maxWidth={680}>
      <ModalHeader
        title={initial ? 'Edit Block' : 'New Block'}
        subtitle="Add or edit a section block (markdown content)"
        onClose={onCancel}
      />

      <div style={{
        flex: 1, overflowY: 'auto', padding: 24,
        display: 'flex', flexDirection: 'column', gap: 16,
        scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Section" required error={errors.section}>
            <Select value={form.section} onChange={set('section')} options={SECTION_IDS} error={errors.section} />
          </Field>
          <Field label="Title" required error={errors.title}>
            <Input value={form.title} onChange={set('title')} placeholder="e.g. Backend Developer @ XYZ" error={errors.title} />
          </Field>
        </div>

        <div>
          <BlockEditor value={form.content} onChange={set('content')} />
          {errors.content && (
            <span style={{ fontSize: 11, color: '#f87171', marginTop: 4, display: 'inline-block' }}>
              ⚠ {errors.content}
            </span>
          )}
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10,
        padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.07)',
        flexShrink: 0,
      }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '9px 18px', borderRadius: 9, border: '1px solid var(--input-border)',
            background: 'transparent', color: 'var(--label-color)',
            fontSize: 14, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
          }}
        >Cancel</button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          style={{
            padding: '9px 22px', borderRadius: 9, border: 'none',
            background: 'var(--accent)', color: '#fff',
            fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            opacity: isSaving ? 0.55 : 1,
            boxShadow: '0 2px 12px rgba(99,102,241,0.35)',
            display: 'flex', alignItems: 'center', gap: 7,
          }}
        >
          {isSaving
            ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'p-spin 0.7s linear infinite' }} />Saving…</>
            : initial ? '💾 Save Changes' : '✓ Add Block'}
        </button>
      </div>
    </Modal>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   HeroCard — display + Edit Hero
   ───────────────────────────────────────────────────────────────────── */
function HeroCard({ profileMain, onEdit }) {
  if (!profileMain) return null
  const { name, title, location, links = [], avatarInitials = '' } = profileMain

  return (
    <div className="card" style={{ padding: '24px 28px' }}>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{
          width: 76, height: 76, borderRadius: '50%', flexShrink: 0,
          background: 'rgba(245,158,11,0.12)', border: '2px solid rgba(245,158,11,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: 'var(--accent)',
        }}>
          {avatarInitials || (name || '?').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
        </div>

        <div style={{ flex: 1, minWidth: 220 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800,
            color: 'var(--text-primary)', margin: '0 0 6px',
          }}>{name || 'Unnamed'}</h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', margin: '0 0 4px' }}>
            {title || ''}
          </p>
          {location && (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
              📍 {location}
            </p>
          )}

          {links.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
              {links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: 12, fontWeight: 600, color: 'var(--accent)',
                    background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                    borderRadius: 6, padding: '5px 12px', textDecoration: 'none',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onEdit}
          style={{
            padding: '8px 16px', borderRadius: 9,
            border: '1px solid var(--input-border)',
            background: 'transparent', color: 'var(--label-color)',
            fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
            cursor: 'pointer', flexShrink: 0, alignSelf: 'flex-start',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}
        >
          ✏ Edit Hero
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────
   Copy All As Markdown — builds a single doc from hero + every block.
   ───────────────────────────────────────────────────────────────────── */
function buildMarkdownDoc(profileMain, sectionsBlocks) {
  const lines = []

  if (profileMain) {
    lines.push(`# ${profileMain.name || 'Profile'}`)
    const subtitle = [profileMain.title, profileMain.location].filter(Boolean).join(' · ')
    if (subtitle) lines.push(`\n## ${subtitle}`)
    if (Array.isArray(profileMain.links) && profileMain.links.length) {
      lines.push('')
      profileMain.links.forEach((l) => {
        lines.push(`- [${l.label}](${l.url})`)
      })
    }
  }

  sectionsBlocks.forEach(({ sectionId, blocks }) => {
    if (!blocks.length) return
    lines.push('')
    lines.push(`## ${sectionId}`)
    blocks.forEach((b) => {
      lines.push('')
      lines.push(`### ${b.title}`)
      lines.push('')
      lines.push(b.content || '')
    })
  })

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n'
}

/* ─────────────────────────────────────────────────────────────────────
   Main page
   ───────────────────────────────────────────────────────────────────── */
export default function Profile() {
  const {
    profileMain, mainLoading,
    blocks, blocksLoading,
    updateProfileMain,
    createBlock, updateBlock, deleteBlock, reorderBlock,
  } = useProfile()

  const [heroFormOpen, setHeroFormOpen]     = useState(false)
  const [heroSaving, setHeroSaving]         = useState(false)
  const [blockForm, setBlockForm]           = useState(null) // { open, initial, defaultSection, saving }
  const [allCopied, setAllCopied]           = useState(false)
  const [seeding, setSeeding]               = useState(false)
  const [notice, setNotice]                 = useState(null) // { type: 'error' | 'success', message }

  /* ── Group blocks by section, sorted by order asc ── */
  const sectionsBlocks = useMemo(() => {
    return SECTION_DEFS.map((def) => ({
      sectionId: def.id,
      icon: def.icon,
      blocks: blocks
        .filter((b) => b.section === def.id)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    }))
  }, [blocks])

  /* ── Handlers ── */
  const openNewBlock = (sectionId) =>
    setBlockForm({ open: true, initial: null, defaultSection: sectionId, saving: false })

  const openEditBlock = (block) =>
    setBlockForm({ open: true, initial: block, defaultSection: block.section, saving: false })

  const closeBlockForm = () => setBlockForm(null)

  const handleBlockSave = async (formData) => {
    if (!blockForm) return
    setBlockForm((p) => ({ ...p, saving: true }))
    setNotice(null)
    try {
      if (blockForm.initial) {
        await updateBlock(blockForm.initial.id, formData)
      } else {
        // New blocks get an order one greater than the current section max
        const sectionBlocks = blocks.filter((b) => b.section === formData.section)
        const maxOrder = sectionBlocks.reduce((m, b) => Math.max(m, b.order ?? 0), 0)
        await createBlock({ ...formData, order: maxOrder + 1 })
      }
      closeBlockForm()
    } catch (err) {
      console.error('Block save failed:', err)
      setNotice({ type: 'error', message: 'Failed to save block. Check your Firebase config.' })
      setBlockForm((p) => ({ ...p, saving: false }))
    }
  }

  const handleHeroSave = async (formData) => {
    setHeroSaving(true)
    setNotice(null)
    try {
      await updateProfileMain(formData)
      setHeroFormOpen(false)
    } catch (err) {
      console.error('Hero save failed:', err)
      setNotice({ type: 'error', message: 'Failed to save hero. Check your Firebase config.' })
    } finally {
      setHeroSaving(false)
    }
  }

  const handleDeleteBlock = async (id) => {
    if (!window.confirm('Delete this block? This cannot be undone.')) return
    await deleteBlock(id)
  }

  const handleCopyAll = async () => {
    const doc = buildMarkdownDoc(profileMain, sectionsBlocks)
    try {
      await navigator.clipboard.writeText(doc)
      setAllCopied(true)
      setNotice(null)
      setTimeout(() => setAllCopied(false), 2000)
    } catch (err) {
      console.error('Clipboard failed:', err)
      setNotice({
        type: 'error',
        message: 'Could not copy. Markdown dumped to the browser console — copy it from there.',
      })
      console.log(doc)
    }
  }

  const handleSeed = async () => {
    if (!window.confirm('Seed profile data from the legacy Profile.js file into Firestore? This only needs to run once.')) return
    setSeeding(true)
    setNotice(null)
    try {
      const result = await seedProfileToFirestore(db)
      setNotice({
        type: 'success',
        message: `Seeded. Wrote ${result.blocksWritten} blocks. Verify on this page, then you may delete src/data/Profile.js manually.`,
      })
    } catch (err) {
      console.error('Seed failed:', err)
      setNotice({ type: 'error', message: 'Seeding failed. Check console and your Firebase config.' })
    } finally {
      setSeeding(false)
    }
  }

  const loading     = mainLoading || blocksLoading
  const isEmpty     = !loading && !profileMain && blocks.length === 0

  /* Block reordering — derive index of current block within its section */
  const moveBlock = async (id, dir) => {
    try {
      await reorderBlock(id, dir)
    } catch (err) {
      console.error('Reorder failed:', err)
    }
  }

  return (
    <div className="page">
      {/* ── Header + Copy All as Markdown ── */}
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Personal</p>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">
            Engineering background, projects, and career information — paste into an AI to generate role-specific CVs.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleCopyAll}
            disabled={loading || (!profileMain && blocks.length === 0)}
            style={{
              padding: '10px 20px', borderRadius: 10,
              border: '1px solid rgba(99,102,241,0.4)',
              background: allCopied
                ? 'rgba(52,211,153,0.15)'
                : 'rgba(99,102,241,0.15)',
              color: allCopied ? '#34d399' : '#a5b4fc',
              fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 12px rgba(99,102,241,0.25)',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}
            title="Copy hero + every section + every block as one markdown document"
          >
            {allCopied ? '✓ Copied to Clipboard' : '📋 Copy All as Markdown'}
          </button>
        </div>
      </div>

      {notice && (
        <div
          role="alert"
          style={{
            padding: '10px 16px', borderRadius: 9, fontSize: 13,
            display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
            background: notice.type === 'success'
              ? 'rgba(52,211,153,0.1)'
              : 'rgba(248,113,113,0.1)',
            border: `1px solid ${notice.type === 'success'
              ? 'rgba(52,211,153,0.3)'
              : 'rgba(248,113,113,0.3)'}`,
            color: notice.type === 'success' ? '#34d399' : '#f87171',
          }}
        >
          <span style={{ flex: 1 }}>⚠ {notice.message}</span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Dismiss"
            style={{
              background: 'transparent', border: 'none',
              color: 'inherit', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 0,
            }}
          >✕</button>
        </div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className="card">
          <div className="empty-state">
            <div className="loading-spinner-lg" />
            <p className="empty-sub" style={{ marginTop: 16 }}>Loading profile…</p>
          </div>
        </div>
      )}

      {/* ── Empty state (offer the seed button) ── */}
      {!loading && isEmpty && (
        <>
          <HeroCard profileMain={profileMain} onEdit={() => setHeroFormOpen(true)} />
          <div className="card">
            <div className="empty-state" style={{ padding: '3rem 2rem' }}>
              <div className="empty-icon">👤</div>
              <p className="empty-title">No profile blocks yet</p>
              <p className="empty-sub">
                Add skills, experience, projects, etc. — or seed from the legacy <code>src/data/Profile.js</code> one-time.
              </p>
              <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => openNewBlock(SECTION_IDS[0])}
                >
                  + Add First Block
                </button>
                <button
                  type="button"
                  onClick={handleSeed}
                  disabled={seeding}
                  style={{
                    padding: '10px 18px', borderRadius: 9,
                    border: '1px dashed rgba(255,255,255,0.2)',
                    background: 'transparent', color: 'var(--label-color)',
                    fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                    cursor: seeding ? 'not-allowed' : 'pointer',
                    opacity: seeding ? 0.6 : 1,
                  }}
                  title="One-time: seed from src/data/Profile.js (delete that file after verifying)"
                >
                  {seeding ? 'Seeding…' : '🌱 Seed from old data'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Loaded: Hero + sections ── */}
      {!loading && !isEmpty && (
        <>
          <HeroCard profileMain={profileMain} onEdit={() => setHeroFormOpen(true)} />

          {sectionsBlocks.map(({ sectionId, icon, blocks: sBlocks }) => (
            <section key={sectionId}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 14, gap: 10,
              }}>
                <h2 style={{
                  margin: 0, fontSize: 13, fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'var(--hint-color)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  <span>{sectionId}</span>
                  <span style={{ fontSize: 11, opacity: 0.7 }}>({sBlocks.length})</span>
                </h2>
                <button
                  type="button"
                  onClick={() => openNewBlock(sectionId)}
                  style={{
                    padding: '6px 14px', borderRadius: 8,
                    border: '1px solid var(--input-border)',
                    background: 'transparent', color: 'var(--label-color)',
                    fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                    cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                  }}
                >
                  + Add Block
                </button>
              </div>

              {sBlocks.length === 0 ? (
                <div style={{
                  padding: '20px 22px', border: '1px dashed rgba(255,255,255,0.08)',
                  borderRadius: 12, color: 'var(--text-muted)', fontSize: 13, textAlign: 'center',
                }}>
                  No blocks in this section yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {sBlocks.map((block, idx) => {
                    const atTop    = idx === 0
                    const atBottom = idx === sBlocks.length - 1
                    return (
                      <div key={block.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        {/* Block header row */}
                        <div style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          background: 'rgba(255,255,255,0.02)',
                          gap: 10,
                        }}>
                          <h3 style={{
                            margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)',
                            fontFamily: 'var(--font-display)',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>{block.title}</h3>
                          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                            <button
                              type="button"
                              onClick={() => moveBlock(block.id, 'up')}
                              disabled={atTop}
                              title="Move up"
                              style={{
                                width: 28, height: 28, borderRadius: 6,
                                border: '1px solid var(--input-border)',
                                background: 'transparent',
                                color: atTop ? '#374151' : 'var(--label-color)',
                                cursor: atTop ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}
                            >▲</button>
                            <button
                              type="button"
                              onClick={() => moveBlock(block.id, 'down')}
                              disabled={atBottom}
                              title="Move down"
                              style={{
                                width: 28, height: 28, borderRadius: 6,
                                border: '1px solid var(--input-border)',
                                background: 'transparent',
                                color: atBottom ? '#374151' : 'var(--label-color)',
                                cursor: atBottom ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}
                            >▼</button>
                            <button
                              type="button"
                              onClick={() => openEditBlock(block)}
                              title="Edit block"
                              style={{
                                width: 28, height: 28, borderRadius: 6,
                                border: '1px solid var(--input-border)',
                                background: 'transparent',
                                color: 'var(--label-color)',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}
                            >✏️</button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBlock(block.id)}
                              title="Delete block"
                              style={{
                                width: 28, height: 28, borderRadius: 6,
                                border: '1px solid var(--input-border)',
                                background: 'transparent',
                                color: '#9ca3af',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}
                            >🗑</button>
                          </div>
                        </div>

                        {/* Block body — MarkdownViewer handles Preview/Raw/Copy */}
                        <MarkdownViewer markdown={block.content} label={`${sectionId} / ${block.title}`} />
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          ))}
        </>
      )}

      {/* ── Modals ── */}
      {heroFormOpen && (
        <HeroForm
          initial={profileMain}
          onSave={handleHeroSave}
          onCancel={() => setHeroFormOpen(false)}
          isSaving={heroSaving}
        />
      )}

      {blockForm?.open && (
        <BlockForm
          initial={blockForm.initial}
          defaultSection={blockForm.defaultSection}
          onSave={handleBlockSave}
          onCancel={closeBlockForm}
          isSaving={blockForm.saving}
        />
      )}
    </div>
  )
}
