import { useState, useEffect } from 'react'

// ─── Default empty form state ────────────────────────────────────────────────
const EMPTY_FORM = {
  // Section 1 — Basic Info
  jobTitle: '',
  refCode: '',
  companyName: '',
  companyLink: '',
  industry: '',
  jobSource: '',

  // Section 2 — Overview
  jobType: '',
  location: '',
  vacancies: '',

  // Section 3 — Role Details
  responsibilities: '',
  kpis: '',
  projects: '',
  tools: '',

  // Section 4 — Qualifications
  education: '',
  certifications: '',
  experienceLevel: '',
  yearsExperience: '',
  industryExperience: '',
  technicalSkills: '',
  softSkills: '',
  languages: '',
  computerLiteracy: '',

  // Section 5 — Compensation
  salaryRange: '',
  salaryType: '',

  // Section 6 — Application Process
  deadline: '',
  applicationMethod: '',
  documentsRequired: '',
  applicationFormat: '',
  submissionLink: '',

  // Section 7 — Selection Process
  screeningSteps: '',
  interviewType: '',
  assessmentDetails: '',

  // Extra
  notes: '',
}

// ─── Form sections config ─────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'basic',      icon: '🏢', label: 'Basic Info',        short: 'Basic' },
  { id: 'overview',   icon: '📋', label: 'Job Overview',       short: 'Overview' },
  { id: 'role',       icon: '🎯', label: 'Role Details',       short: 'Role' },
  { id: 'quals',      icon: '🎓', label: 'Qualifications',     short: 'Quals' },
  { id: 'comp',       icon: '💰', label: 'Compensation',       short: 'Pay' },
  { id: 'apply',      icon: '📤', label: 'Application',        short: 'Apply' },
  { id: 'selection',  icon: '🔍', label: 'Selection Process',  short: 'Selection' },
]

// ─── Field components ─────────────────────────────────────────────────────────
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

function Textarea({ value, onChange, placeholder, rows = 4 }) {
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

function Select({ value, onChange, options, placeholder }) {
  return (
    <select className="form-select" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder || 'Select…'}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  )
}

// ─── Section panels ───────────────────────────────────────────────────────────
function SectionBasic({ form, set }) {
  return (
    <div className="form-section-body">
      <div className="form-grid-2">
        <Field label="Job Title / Position" required>
          <Input value={form.jobTitle} onChange={set('jobTitle')} placeholder="e.g. Software Engineer, Marketing Executive" />
        </Field>
        <Field label="Job Reference Code" hint="optional">
          <Input value={form.refCode} onChange={set('refCode')} placeholder="e.g. HR-2025-042" />
        </Field>
      </div>
      <div className="form-grid-2">
        <Field label="Company Name" required>
          <Input value={form.companyName} onChange={set('companyName')} placeholder="e.g. bKash Limited" />
        </Field>
        <Field label="Company Link" hint="website, LinkedIn, Facebook">
          <Input value={form.companyLink} onChange={set('companyLink')} placeholder="https://…" />
        </Field>
      </div>
      <div className="form-grid-2">
        <Field label="Industry">
          <Select
            value={form.industry}
            onChange={set('industry')}
            placeholder="Select industry"
            options={[
              'IT / Software', 'Banking / Finance', 'Telecom', 'Healthcare',
              'E-Commerce / Retail', 'Manufacturing', 'NGO / Development',
              'Education', 'Media / Marketing', 'Logistics', 'Consulting', 'Other',
            ]}
          />
        </Field>
        <Field label="Job Source" hint="where you found it">
          <Select
            value={form.jobSource}
            onChange={set('jobSource')}
            placeholder="Select source"
            options={['LinkedIn', 'Bdjobs', 'Company Website', 'Facebook', 'Referral', 'Newspaper', 'Other']}
          />
        </Field>
      </div>
    </div>
  )
}

function SectionOverview({ form, set }) {
  return (
    <div className="form-section-body">
      <div className="form-grid-3">
        <Field label="Job Type">
          <Select
            value={form.jobType}
            onChange={set('jobType')}
            options={['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance', 'Remote', 'Hybrid', 'On-site']}
          />
        </Field>
        <Field label="Job Location">
          <Input value={form.location} onChange={set('location')} placeholder="e.g. Dhaka, BD / Remote" />
        </Field>
        <Field label="Number of Vacancies">
          <Input value={form.vacancies} onChange={set('vacancies')} placeholder="e.g. 3" />
        </Field>
      </div>
    </div>
  )
}

function SectionRole({ form, set }) {
  return (
    <div className="form-section-body">
      <Field label="Key Responsibilities / Duties" hint="paste from job post">
        <Textarea value={form.responsibilities} onChange={set('responsibilities')}
          placeholder="• Develop and maintain web applications&#10;• Collaborate with cross-functional teams&#10;• Write clean, testable code…" rows={5} />
      </Field>
      <Field label="Key Performance Indicators (KPIs)" hint="optional">
        <Textarea value={form.kpis} onChange={set('kpis')}
          placeholder="e.g. Monthly sales targets, code review turnaround…" rows={3} />
      </Field>
      <div className="form-grid-2">
        <Field label="Projects / Products to Handle" hint="optional">
          <Textarea value={form.projects} onChange={set('projects')}
            placeholder="e.g. Mobile app, internal ERP system…" rows={3} />
        </Field>
        <Field label="Tools / Software Required" hint="optional">
          <Textarea value={form.tools} onChange={set('tools')}
            placeholder="e.g. Jira, Figma, Salesforce, AutoCAD…" rows={3} />
        </Field>
      </div>
    </div>
  )
}

function SectionQuals({ form, set }) {
  return (
    <div className="form-section-body">
      <div className="form-grid-2">
        <Field label="Educational Background">
          <Textarea value={form.education} onChange={set('education')}
            placeholder="e.g. BSc in CSE, minimum CGPA 3.0, any reputed university" rows={3} />
        </Field>
        <Field label="Professional Certifications" hint="optional">
          <Textarea value={form.certifications} onChange={set('certifications')}
            placeholder="e.g. PMP, CFA, AWS Certified…" rows={3} />
        </Field>
      </div>
      <div className="form-grid-3">
        <Field label="Experience Level">
          <Select
            value={form.experienceLevel}
            onChange={set('experienceLevel')}
            options={['Entry Level', 'Mid Level', 'Senior Level', 'Executive', 'Fresher']}
          />
        </Field>
        <Field label="Years of Experience">
          <Input value={form.yearsExperience} onChange={set('yearsExperience')} placeholder="e.g. 2–4 years" />
        </Field>
        <Field label="Specific Industry Experience" hint="optional">
          <Input value={form.industryExperience} onChange={set('industryExperience')} placeholder="e.g. Banking, Retail" />
        </Field>
      </div>
      <div className="form-grid-2">
        <Field label="Technical Skills">
          <Textarea value={form.technicalSkills} onChange={set('technicalSkills')}
            placeholder="e.g. Python, React, SQL, Excel, Power BI…" rows={3} />
        </Field>
        <Field label="Soft Skills">
          <Textarea value={form.softSkills} onChange={set('softSkills')}
            placeholder="e.g. Leadership, Communication, Problem Solving…" rows={3} />
        </Field>
      </div>
      <div className="form-grid-2">
        <Field label="Language Proficiency">
          <Input value={form.languages} onChange={set('languages')} placeholder="e.g. English (Fluent), Bengali (Native)" />
        </Field>
        <Field label="Computer Literacy">
          <Input value={form.computerLiteracy} onChange={set('computerLiteracy')} placeholder="e.g. MS Office, Google Workspace" />
        </Field>
      </div>
    </div>
  )
}

function SectionComp({ form, set }) {
  return (
    <div className="form-section-body">
      <div className="form-grid-2">
        <Field label="Salary Range" hint="monthly or annual">
          <Input value={form.salaryRange} onChange={set('salaryRange')} placeholder="e.g. 30,000–45,000 BDT/month" />
        </Field>
        <Field label="Salary Type">
          <Select
            value={form.salaryType}
            onChange={set('salaryType')}
            options={['Gross', 'Net', 'Negotiable', 'Gross + Benefits', 'Confidential']}
          />
        </Field>
      </div>
    </div>
  )
}

function SectionApply({ form, set }) {
  return (
    <div className="form-section-body">
      <div className="form-grid-2">
        <Field label="Application Deadline" required>
          <Input value={form.deadline} onChange={set('deadline')} type="date" />
        </Field>
        <Field label="Application Method">
          <Select
            value={form.applicationMethod}
            onChange={set('applicationMethod')}
            options={['Email', 'Online Portal', 'In-person', 'LinkedIn Easy Apply', 'Bdjobs Apply', 'Company Website Form']}
          />
        </Field>
      </div>
      <div className="form-grid-2">
        <Field label="Documents Required">
          <Textarea value={form.documentsRequired} onChange={set('documentsRequired')}
            placeholder="e.g. CV/Resume, Cover Letter, Transcripts, Portfolio, NID…" rows={3} />
        </Field>
        <Field label="Application Format">
          <Select
            value={form.applicationFormat}
            onChange={set('applicationFormat')}
            options={['PDF', 'Word (.docx)', 'Online Form', 'Email Body', 'Any']}
          />
        </Field>
      </div>
      <Field label="Submission Email / Link">
        <Input value={form.submissionLink} onChange={set('submissionLink')} placeholder="careers@company.com or https://apply.company.com/…" />
      </Field>
    </div>
  )
}

function SectionSelection({ form, set }) {
  return (
    <div className="form-section-body">
      <Field label="Screening Steps">
        <Textarea value={form.screeningSteps} onChange={set('screeningSteps')}
          placeholder="e.g. CV Shortlisting → Written Test → Technical Interview → HR Interview → Final Offer" rows={3} />
      </Field>
      <div className="form-grid-2">
        <Field label="Interview Type">
          <Select
            value={form.interviewType}
            onChange={set('interviewType')}
            options={['In-person', 'Zoom / Video Call', 'Phone Call', 'Panel Interview', 'Case Study', 'Technical Assessment']}
          />
        </Field>
        <Field label="Assessment Details" hint="optional">
          <Textarea value={form.assessmentDetails} onChange={set('assessmentDetails')}
            placeholder="e.g. 60-min written test on accounting, MCQ + short answer…" rows={3} />
        </Field>
      </div>
      <Field label="Personal Notes" hint="anything you want to remember about this job">
        <Textarea value={form.notes} onChange={set('notes')}
          placeholder="Why this job interests you, who referred you, red flags, things to research…" rows={3} />
      </Field>
    </div>
  )
}

// ─── Main JobForm Component ───────────────────────────────────────────────────
export default function JobForm({ initialData, onSave, onCancel, isSaving }) {
  const [form, setForm] = useState(initialData ? { ...EMPTY_FORM, ...initialData } : EMPTY_FORM)
  const [activeSection, setActiveSection] = useState(0)
  const [errors, setErrors] = useState({})

  // Helper: returns a setter function for a field key
  const set = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }))

  const validate = () => {
    const e = {}
    if (!form.jobTitle.trim()) e.jobTitle = 'Job title is required'
    if (!form.companyName.trim()) e.companyName = 'Company name is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) {
      setActiveSection(0) // jump to basic info
      return
    }
    onSave(form)
  }

  const sectionComponents = [
    <SectionBasic form={form} set={set} key="basic" />,
    <SectionOverview form={form} set={set} key="overview" />,
    <SectionRole form={form} set={set} key="role" />,
    <SectionQuals form={form} set={set} key="quals" />,
    <SectionComp form={form} set={set} key="comp" />,
    <SectionApply form={form} set={set} key="apply" />,
    <SectionSelection form={form} set={set} key="selection" />,
  ]

  const isFirst = activeSection === 0
  const isLast = activeSection === SECTIONS.length - 1

  return (
    <div className="jf-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="jf-modal">

        {/* Header */}
        <div className="jf-header">
          <div className="jf-header-left">
            <div className="jf-header-icon">💼</div>
            <div>
              <h2 className="jf-title">{initialData ? 'Edit Job' : 'Add New Job'}</h2>
              <p className="jf-subtitle">
                {form.companyName && form.jobTitle
                  ? `${form.jobTitle} @ ${form.companyName}`
                  : 'Fill in as much as you can from the job circular'}
              </p>
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

        {/* Section tabs */}
        <div className="jf-section-tabs">
          {SECTIONS.map((s, i) => (
            <button
              key={s.id}
              className={`jf-section-tab ${activeSection === i ? 'jf-section-tab--active' : ''} ${i < activeSection ? 'jf-section-tab--done' : ''}`}
              onClick={() => setActiveSection(i)}
            >
              <span className="jf-tab-icon">{i < activeSection ? '✓' : s.icon}</span>
              <span className="jf-tab-label">{s.short}</span>
            </button>
          ))}
        </div>

        {/* Section heading */}
        <div className="jf-section-heading">
          <span className="jf-section-icon">{SECTIONS[activeSection].icon}</span>
          <div>
            <h3 className="jf-section-title">{SECTIONS[activeSection].label}</h3>
            <p className="jf-section-progress">Section {activeSection + 1} of {SECTIONS.length}</p>
          </div>
        </div>

        {/* Form body */}
        <div className="jf-body">
          {sectionComponents[activeSection]}
        </div>

        {/* Footer navigation */}
        <div className="jf-footer">
          <div className="jf-footer-left">
            <button className="jf-btn-ghost" onClick={onCancel}>Cancel</button>
          </div>
          <div className="jf-footer-right">
            {!isFirst && (
              <button className="jf-btn-secondary" onClick={() => setActiveSection((s) => s - 1)}>
                ← Previous
              </button>
            )}
            {!isLast ? (
              <button className="jf-btn-next" onClick={() => setActiveSection((s) => s + 1)}>
                Next →
              </button>
            ) : (
              <button className="jf-btn-save" onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <><span className="jf-spinner" /> Saving…</>
                ) : (
                  <>{initialData ? '💾 Save Changes' : '✅ Save Job'}</>
                )}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}