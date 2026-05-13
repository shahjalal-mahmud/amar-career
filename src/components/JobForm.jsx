import { useState } from 'react'

const EMPTY_FORM = {
  jobTitle: '',
  companyName: '',
  circularLink: '',
  companyWebsite: '',
  salary: '',
  notes: '',
}

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

function Textarea({ value, onChange, placeholder, rows = 5 }) {
  return (
    <textarea
      className="form-textarea"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
    />
  )
}

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
          <div className="jf-errors">
            ⚠️ {Object.values(errors).join(' · ')}
          </div>
        )}

        {/* Form body */}
        <div className="jf-body">
          <div className="form-section-body">

            <div className="form-grid-2">
              <Field label="Job Title" required>
                <Input
                  value={form.jobTitle}
                  onChange={set('jobTitle')}
                  placeholder="e.g. Software Engineer"
                />
              </Field>
              <Field label="Company Name" required>
                <Input
                  value={form.companyName}
                  onChange={set('companyName')}
                  placeholder="e.g. bKash Limited"
                />
              </Field>
            </div>

            <div className="form-grid-2">
              <Field label="Job Circular Link" hint="paste the URL">
                <Input
                  value={form.circularLink}
                  onChange={set('circularLink')}
                  placeholder="https://bdjobs.com/…"
                />
              </Field>
              <Field label="Company Website" hint="optional">
                <Input
                  value={form.companyWebsite}
                  onChange={set('companyWebsite')}
                  placeholder="https://company.com"
                />
              </Field>
            </div>

            <Field label="Salary" hint="whatever's shown in the circular">
              <Input
                value={form.salary}
                onChange={set('salary')}
                placeholder="e.g. 30,000–45,000 BDT/month, Negotiable"
              />
            </Field>

            <Field label="Extra Info" hint="paste the job post, responsibilities, requirements — anything you want to save">
              <Textarea
                value={form.notes}
                onChange={set('notes')}
                placeholder="Paste job description, requirements, deadlines, application process, or any notes here…"
                rows={8}
              />
            </Field>

          </div>
        </div>

        {/* Footer */}
        <div className="jf-footer">
          <div className="jf-footer-left">
            <button className="jf-btn-ghost" onClick={onCancel}>Cancel</button>
          </div>
          <div className="jf-footer-right">
            <button className="jf-btn-save" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <><span className="jf-spinner" /> Saving…</>
              ) : (
                <>{initialData ? '💾 Save Changes' : '✅ Save Job'}</>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}