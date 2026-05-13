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

// ── Minimal markdown renderer (no external dep needed) ────────────────────────
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

  // Handle lists: group consecutive bullet/numbered lines
  html = html.replace(/(?:^|\n)((?:\s*[-*+] .+\n?)+)/gm, (_, block) => {
    const items = block.trim().split('\n').map(l => `<li>${l.replace(/^\s*[-*+] /, '')}</li>`).join('')
    return `\n<ul>${items}</ul>\n`
  })
  html = html.replace(/(?:^|\n)((?:\s*\d+\. .+\n?)+)/gm, (_, block) => {
    const items = block.trim().split('\n').map(l => `<li>${l.replace(/^\s*\d+\. /, '')}</li>`).join('')
    return `\n<ol>${items}</ol>\n`
  })

  // Paragraphs for leftover plain text blocks
  html = html.split(/\n\n+/).map((block) => {
    const t = block.trim()
    if (!t) return ''
    if (/^<(h[1-6]|ul|ol|blockquote|hr)/.test(t)) return t
    return `<p>${t.replace(/\n/g, '<br/>')}</p>`
  }).join('\n')

  return html
}

// ── Shared field components ───────────────────────────────────────────────────
function Field({ label, hint, required, children }) {
  return (
    <div className="form-field">
      <label className="form-label">
        {label}
        {required && <span className="form-required">*</span>}
        {hint && <span className="form-hint">{hint}</span>}
      </label>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      className="form-input"
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  )
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select className="form-select" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder || 'Select…'}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

// ── Markdown editor with Edit / Preview toggle ────────────────────────────────
function MarkdownEditor({ value, onChange }) {
  const [mode, setMode] = useState('edit')

  return (
    <div className="md-editor">
      <div className="md-editor-toolbar">
        <span className="md-editor-label">
          📋 Extra Info
          <span className="form-hint">paste job post, requirements, deadlines — in Markdown</span>
        </span>
        <div className="md-editor-tabs">
          <button
            type="button"
            className={`md-tab ${mode === 'edit' ? 'md-tab--active' : ''}`}
            onClick={() => setMode('edit')}
          >
            ✏️ Edit
          </button>
          <button
            type="button"
            className={`md-tab ${mode === 'preview' ? 'md-tab--active' : ''}`}
            onClick={() => setMode('preview')}
          >
            👁 Preview
          </button>
        </div>
      </div>

      {mode === 'edit' ? (
        <textarea
          className="form-textarea md-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Write or paste in Markdown...\n\n## Requirements\n- 2+ years React experience\n- Good communication\n\n## Responsibilities\n- Build and ship features\n\n**Deadline:** June 30, 2025`}
          rows={10}
          spellCheck={false}
        />
      ) : (
        <div
          className="md-preview"
          dangerouslySetInnerHTML={{
            __html: renderMarkdown(value) || '<p class="md-empty">Nothing to preview yet.</p>'
          }}
        />
      )}

      <p className="md-hint-bar">
        Supports <code>**bold**</code>, <code>*italic*</code>, <code># Heading</code>, <code>- list</code>, <code>`code`</code>, <code>[link](url)</code>
      </p>
    </div>
  )
}

// ── Main JobForm ──────────────────────────────────────────────────────────────
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

  const subtitle = form.companyName && form.jobTitle
    ? `${form.jobTitle} @ ${form.companyName}`
    : 'Fill in what you know — you can always edit later'

  return (
    <div className="jf-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="jf-modal">

        {/* Header */}
        <div className="jf-header">
          <div className="jf-header-left">
            <div className="jf-header-icon">💼</div>
            <div>
              <h2 className="jf-title">{initialData ? 'Edit Job' : 'Add New Job'}</h2>
              <p className="jf-subtitle">{subtitle}</p>
            </div>
          </div>
          <button className="jf-close" onClick={onCancel} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Validation errors */}
        {Object.keys(errors).length > 0 && (
          <div className="jf-errors">⚠️ {Object.values(errors).join(' · ')}</div>
        )}

        {/* Form body */}
        <div className="jf-body">
          <div className="form-section-body">

            {/* Row 1: Title + Company */}
            <div className="form-grid-2">
              <Field label="Job Title" required>
                <Input value={form.jobTitle} onChange={set('jobTitle')} placeholder="e.g. Software Engineer" />
              </Field>
              <Field label="Company Name" required>
                <Input value={form.companyName} onChange={set('companyName')} placeholder="e.g. bKash Limited" />
              </Field>
            </div>

            {/* Row 2: Job Type + Location */}
            <div className="form-grid-2">
              <Field label="Job Type">
                <Select value={form.jobType} onChange={set('jobType')} placeholder="Select type…" options={JOB_TYPES} />
              </Field>
              <Field label="Location">
                <Input value={form.location} onChange={set('location')} placeholder="e.g. Dhaka / Remote / Anywhere" />
              </Field>
            </div>

            {/* Row 3: Circular link + Company website */}
            <div className="form-grid-2">
              <Field label="Job Circular Link" hint="paste the URL">
                <Input value={form.circularLink} onChange={set('circularLink')} placeholder="https://bdjobs.com/…" />
              </Field>
              <Field label="Company Website" hint="optional">
                <Input value={form.companyWebsite} onChange={set('companyWebsite')} placeholder="https://company.com" />
              </Field>
            </div>

            {/* Row 4: Salary + CV link */}
            <div className="form-grid-2">
              <Field label="Salary" hint="from the circular">
                <Input value={form.salary} onChange={set('salary')} placeholder="e.g. 30,000–45,000 BDT/month" />
              </Field>
              <Field label="CV / Resume Link" hint="GitHub, Drive — the version you submitted">
                <Input value={form.cvLink} onChange={set('cvLink')} placeholder="https://github.com/you/cv/blob/main/cv-v3.pdf" />
              </Field>
            </div>

            {/* Markdown editor */}
            <MarkdownEditor value={form.notes} onChange={set('notes')} />

          </div>
        </div>

        {/* Footer */}
        <div className="jf-footer">
          <div className="jf-footer-left">
            <button className="jf-btn-ghost" onClick={onCancel}>Cancel</button>
          </div>
          <div className="jf-footer-right">
            <button className="jf-btn-save" onClick={handleSave} disabled={isSaving}>
              {isSaving
                ? <><span className="jf-spinner" /> Saving…</>
                : <>{initialData ? '💾 Save Changes' : '✅ Save Job'}</>
              }
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}