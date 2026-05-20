import { useState } from 'react'

const EMPTY_FORM = {
  jobTitle: '',
  companyName: '',
  jobType: '',
  location: '',
  circularLink: '',
  companyWebsite: '',
  salary: '',
  cvLink: '',
  notes: '',
}

const JOB_TYPES = ['Full-time', 'Part-time', 'Remote', 'Hybrid', 'On-site', 'Internship', 'Contract', 'Freelance']

export function renderMarkdown(md) {
  if (!md) return ''
  let html = md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/^---$/gm, '<hr/>')

  html = html.replace(/(?:^|\n)((?:\s*[-*+] .+\n?)+)/gm, (_, block) => {
    const items = block.trim().split('\n').map(l => `<li>${l.replace(/^\s*[-*+] /, '')}</li>`).join('')
    return `\n<ul>${items}</ul>\n`
  })
  html = html.replace(/(?:^|\n)((?:\s*\d+\. .+\n?)+)/gm, (_, block) => {
    const items = block.trim().split('\n').map(l => `<li>${l.replace(/^\s*\d+\. /, '')}</li>`).join('')
    return `\n<ol>${items}</ol>\n`
  })

  html = html.split(/\n\n+/).map((block) => {
    const t = block.trim()
    if (!t) return ''
    if (/^<(h[1-6]|ul|ol|blockquote|hr)/.test(t)) return t
    return `<p>${t.replace(/\n/g, '<br/>')}</p>`
  }).join('\n')

  return html
}

/* ── Icon primitives ── */
const IconBriefcase = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <line x1="12" y1="12" x2="12" y2="12"/><path d="M2 12h20"/>
  </svg>
)
const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

/* ── Field wrapper ── */
function Field({ label, hint, required, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        fontSize: '12px', fontWeight: '600', letterSpacing: '0.06em',
        textTransform: 'uppercase', color: 'var(--label-color)',
        display: 'flex', alignItems: 'center', gap: '6px'
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
  transition: 'border-color 0.15s, box-shadow 0.15s',
  boxSizing: 'border-box',
})

function Input({ value, onChange, placeholder, type = 'text', error }) {
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

function Select({ value, onChange, options, placeholder, error }) {
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
      <option value="">{placeholder || 'Select…'}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

function MarkdownEditor({ value, onChange }) {
  const [mode, setMode] = useState('edit')
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px',
        background: 'var(--input-bg)',
        border: '1.5px solid var(--input-border)',
        borderBottom: 'none',
        borderRadius: '10px 10px 0 0',
      }}>
        <span style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--label-color)' }}>
          Notes
          <span style={{ fontSize: '11px', fontWeight: '400', textTransform: 'none', letterSpacing: 0, color: 'var(--hint-color)', marginLeft: '8px' }}>
            supports Markdown · paste job post, requirements, deadlines
          </span>
        </span>
        <div style={{ display: 'flex', gap: '2px', background: 'var(--tab-bg)', borderRadius: '7px', padding: '2px' }}>
          {['edit', 'preview'].map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              style={{
                padding: '4px 12px', borderRadius: '5px', border: 'none', cursor: 'pointer',
                fontSize: '12px', fontWeight: '600', fontFamily: 'inherit',
                background: mode === m ? 'var(--tab-active-bg)' : 'transparent',
                color: mode === m ? 'var(--text-primary)' : 'var(--hint-color)',
                transition: 'all 0.15s',
                boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
              }}
            >
              {m === 'edit' ? '✏ Edit' : '👁 Preview'}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      {mode === 'edit' ? (
        <textarea
          style={{
            ...inputStyle(false),
            borderRadius: '0 0 10px 10px',
            borderColor: focused ? 'var(--accent)' : 'var(--input-border)',
            boxShadow: focused ? '0 0 0 3px var(--accent-glow)' : 'none',
            resize: 'vertical', minHeight: '180px',
            fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
            fontSize: '13px', lineHeight: '1.7',
          }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`## Requirements\n- 2+ years React experience\n- Strong communication\n\n## Responsibilities\n- Build and ship features\n\n**Deadline:** June 30, 2025`}
          rows={8}
          spellCheck={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      ) : (
        <div
          style={{
            ...inputStyle(false),
            borderRadius: '0 0 10px 10px',
            minHeight: '180px', lineHeight: '1.7', fontSize: '14px',
          }}
          className="md-preview"
          dangerouslySetInnerHTML={{
            __html: renderMarkdown(value) || '<p style="color:var(--hint-color);font-style:italic">Nothing to preview yet.</p>'
          }}
        />
      )}
    </div>
  )
}

/* ── Main form ── */
export default function JobForm({ initialData, onSave, onCancel, isSaving }) {
  const [form, setForm] = useState(initialData ? { ...EMPTY_FORM, ...initialData } : EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const set = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }))

  const validate = () => {
    const e = {}
    if (!form.jobTitle.trim()) e.jobTitle = 'Job title is required'
    if (!form.companyName.trim()) e.companyName = 'Company name is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    onSave(form)
  }

  const isEdit = !!initialData

  return (
    <>
      {/* Styles */}
      <style>{`
        :root {
          --accent: #6366f1;
          --accent-glow: rgba(99,102,241,0.18);
          --input-bg: rgba(255,255,255,0.04);
          --input-border: rgba(255,255,255,0.1);
          --label-color: #9ca3af;
          --hint-color: #6b7280;
          --text-primary: #f9fafb;
          --tab-bg: rgba(0,0,0,0.2);
          --tab-active-bg: rgba(255,255,255,0.08);
          --modal-bg: #111827;
          --modal-border: rgba(255,255,255,0.08);
          --header-border: rgba(255,255,255,0.07);
          --section-bg: rgba(255,255,255,0.02);
        }

        .jf-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          animation: jf-fade-in 0.15s ease;
        }
        @keyframes jf-fade-in { from { opacity: 0 } to { opacity: 1 } }

        .jf-modal {
          background: var(--modal-bg);
          border: 1px solid var(--modal-border);
          border-radius: 18px;
          width: 100%; max-width: 640px;
          max-height: 92vh;
          display: flex; flex-direction: column;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
          animation: jf-slide-up 0.2s cubic-bezier(0.16,1,0.3,1);
          overflow: hidden;
        }
        @keyframes jf-slide-up { from { opacity: 0; transform: translateY(20px) scale(0.98) } to { opacity: 1; transform: none } }

        .jf-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 24px 18px;
          border-bottom: 1px solid var(--header-border);
          flex-shrink: 0;
        }

        .jf-body {
          flex: 1; overflow-y: auto; padding: 24px;
          display: flex; flex-direction: column; gap: 20px;
          scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent;
        }

        .jf-section {
          display: flex; flex-direction: column; gap: 16px;
          background: var(--section-bg);
          border: 1px solid var(--header-border);
          border-radius: 12px;
          padding: 16px;
        }

        .jf-section-label {
          font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--hint-color);
          margin-bottom: 2px;
        }

        .jf-grid-2 {
          display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
        }
        @media (max-width: 520px) {
          .jf-grid-2 { grid-template-columns: 1fr; }
          .jf-modal { border-radius: 16px; }
          .jf-body { padding: 16px; }
          .jf-header { padding: 16px 18px; }
          .jf-footer { padding: 14px 18px; }
        }

        .jf-footer {
          display: flex; align-items: center; justify-content: flex-end; gap: 10px;
          padding: 16px 24px;
          border-top: 1px solid var(--header-border);
          flex-shrink: 0;
        }

        .btn-ghost {
          padding: 9px 18px; border-radius: 9px; border: 1px solid var(--input-border);
          background: transparent; color: var(--label-color);
          font-size: 14px; font-weight: 500; font-family: inherit; cursor: pointer;
          transition: all 0.15s;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }

        .btn-save {
          padding: 9px 22px; border-radius: 9px; border: none;
          background: var(--accent); color: #fff;
          font-size: 14px; font-weight: 600; font-family: inherit; cursor: pointer;
          transition: all 0.15s; display: flex; align-items: center; gap: 7px;
          box-shadow: 0 2px 12px rgba(99,102,241,0.35);
        }
        .btn-save:hover:not(:disabled) { background: #4f52e8; box-shadow: 0 4px 16px rgba(99,102,241,0.45); transform: translateY(-1px); }
        .btn-save:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

        .jf-close-btn {
          width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--input-border);
          background: transparent; color: var(--label-color);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.15s; flex-shrink: 0;
        }
        .jf-close-btn:hover { background: rgba(255,255,255,0.07); color: var(--text-primary); }

        .jf-error-bar {
          margin: 0 24px;
          padding: 10px 14px; border-radius: 9px;
          background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.25);
          color: #f87171; font-size: 13px; flex-shrink: 0;
          display: flex; align-items: center; gap: 8px;
        }

        .md-preview { }
        .md-preview p { margin: 0 0 10px; }
        .md-preview h1, .md-preview h2, .md-preview h3 { margin: 14px 0 6px; color: var(--text-primary); }
        .md-preview ul, .md-preview ol { padding-left: 20px; margin: 0 0 10px; }
        .md-preview li { margin-bottom: 3px; }
        .md-preview code { background: rgba(255,255,255,0.08); padding: 1px 5px; border-radius: 4px; font-size: 12px; }
        .md-preview a { color: var(--accent); }
        .md-preview blockquote { border-left: 3px solid var(--accent); padding-left: 12px; color: var(--label-color); }
        .md-preview hr { border: none; border-top: 1px solid var(--input-border); margin: 14px 0; }
      `}</style>

      <div className="jf-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
        <div className="jf-modal">

          {/* Header */}
          <div className="jf-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <IconBriefcase />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {isEdit ? 'Edit Application' : 'Add New Job'}
                </h2>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--hint-color)', marginTop: '1px' }}>
                  {form.companyName && form.jobTitle
                    ? `${form.jobTitle} · ${form.companyName}`
                    : 'Fill in what you know — you can always edit later'}
                </p>
              </div>
            </div>
            <button className="jf-close-btn" onClick={onCancel} aria-label="Close">
              <IconClose />
            </button>
          </div>

          {/* Error bar */}
          {Object.keys(errors).length > 0 && (
            <div className="jf-error-bar">
              ⚠ {Object.values(errors).join(' · ')}
            </div>
          )}

          {/* Body */}
          <div className="jf-body">

            {/* Core info */}
            <div className="jf-section">
              <div className="jf-section-label">Position</div>
              <div className="jf-grid-2">
                <Field label="Job Title" required error={errors.jobTitle}>
                  <Input value={form.jobTitle} onChange={set('jobTitle')} placeholder="e.g. Software Engineer" error={errors.jobTitle} />
                </Field>
                <Field label="Company" required error={errors.companyName}>
                  <Input value={form.companyName} onChange={set('companyName')} placeholder="e.g. bKash Limited" error={errors.companyName} />
                </Field>
              </div>
              <div className="jf-grid-2">
                <Field label="Job Type">
                  <Select value={form.jobType} onChange={set('jobType')} placeholder="Select type…" options={JOB_TYPES} />
                </Field>
                <Field label="Location">
                  <Input value={form.location} onChange={set('location')} placeholder="e.g. Dhaka / Remote" />
                </Field>
              </div>
            </div>

            {/* Links */}
            <div className="jf-section">
              <div className="jf-section-label">Links & Salary</div>
              <div className="jf-grid-2">
                <Field label="Job Circular" hint="URL">
                  <Input value={form.circularLink} onChange={set('circularLink')} placeholder="https://bdjobs.com/…" />
                </Field>
                <Field label="Company Website" hint="optional">
                  <Input value={form.companyWebsite} onChange={set('companyWebsite')} placeholder="https://company.com" />
                </Field>
              </div>
              <div className="jf-grid-2">
                <Field label="Salary" hint="from circular">
                  <Input value={form.salary} onChange={set('salary')} placeholder="e.g. 30,000–45,000 BDT/mo" />
                </Field>
                <Field label="CV / Resume Link" hint="GitHub URL">
                  <Input value={form.cvLink} onChange={set('cvLink')} placeholder="https://github.com/you/cv/…" />
                </Field>
              </div>
            </div>

            {/* Notes */}
            <MarkdownEditor value={form.notes} onChange={set('notes')} />

          </div>

          {/* Footer */}
          <div className="jf-footer">
            <button className="btn-ghost" onClick={onCancel}>Cancel</button>
            <button className="btn-save" onClick={handleSave} disabled={isSaving}>
              {isSaving
                ? <><span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />Saving…</>
                : isEdit ? '💾 Save Changes' : '✓ Add Job'}
            </button>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>
    </>
  )
}