import { useState, useMemo } from 'react'
import { useNotes } from '../hooks/useNotes'
import { renderMarkdown } from '../components/JobForm'

/* ── Fixed categories — exactly these 4 per project.md §4.3 ── */
const NOTE_CATEGORIES = [
  'Tips',
  'Interview Questions',
  'Preparation Notes',
  'Mistakes & Learnings',
]

const CATEGORY_ICONS = {
  'Tips':                 '💡',
  'Interview Questions':  '❓',
  'Preparation Notes':    '📚',
  'Mistakes & Learnings': '⚡',
}

const CATEGORY_COLORS = {
  'Tips':                 { bg: 'rgba(251,191,36,0.1)',  text: '#fbbf24', border: 'rgba(251,191,36,0.25)' },
  'Interview Questions':  { bg: 'rgba(96,165,250,0.1)',  text: '#60a5fa', border: 'rgba(96,165,250,0.25)' },
  'Preparation Notes':    { bg: 'rgba(167,139,250,0.1)', text: '#a78bfa', border: 'rgba(167,139,250,0.25)' },
  'Mistakes & Learnings': { bg: 'rgba(248,113,113,0.1)', text: '#f87171', border: 'rgba(248,113,113,0.25)' },
}

const EMPTY_FORM = {
  title: '',
  category: 'Tips',
  description: '',
}

/* ── Shared field/input primitives (mirror JobForm's visual language) ── */
function Field({ label, required, error, hint, children }) {
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
  boxSizing: 'border-box',
})

function Input({ value, onChange, placeholder, error }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      style={{
        ...inputStyle(error),
        borderColor: focused ? 'var(--accent)' : (error ? '#f87171' : 'var(--input-border)'),
        boxShadow: focused ? '0 0 0 3px var(--accent-glow)' : 'none',
      }}
      type="text"
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
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

/* ── Markdown editor with Edit/Preview toggle (same pattern as JobForm) ── */
function MarkdownEditor({ value, onChange }) {
  const [mode, setMode] = useState('edit')
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
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
          Description
          <span style={{ fontSize: '11px', fontWeight: '400', textTransform: 'none', letterSpacing: 0, color: 'var(--hint-color)', marginLeft: '8px' }}>
            Markdown · paste Q&A, headings, lists
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
            resize: 'vertical', minHeight: '200px',
            fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
            fontSize: '13px', lineHeight: '1.7',
          }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`## Question\nWhat is closure in JavaScript?\n\n## Answer\nA function that remembers its outer scope…`}
          rows={10}
          spellCheck={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      ) : (
        <div
          style={{
            ...inputStyle(false),
            borderRadius: '0 0 10px 10px',
            minHeight: '200px', lineHeight: '1.7', fontSize: '14px',
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

/* ── Note form modal ── */
function NoteForm({ initial, onSave, onCancel, isSaving }) {
  const [form, setForm] = useState(initial ? { ...EMPTY_FORM, ...initial } : EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const set = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }))

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.description.trim()) e.description = 'Description is required'
    if (!NOTE_CATEGORIES.includes(form.category)) e.category = 'Category is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    onSave(form)
  }

  const isEdit = !!initial

  return (
    <>
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
        }
        .nf-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          animation: nf-fade-in 0.15s ease;
        }
        @keyframes nf-fade-in { from { opacity: 0 } to { opacity: 1 } }
        .nf-modal {
          background: var(--modal-bg);
          border: 1px solid var(--modal-border);
          border-radius: 18px;
          width: 100%; max-width: 640px;
          max-height: 92vh;
          display: flex; flex-direction: column;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
          animation: nf-slide-up 0.2s cubic-bezier(0.16,1,0.3,1);
          overflow: hidden;
        }
        @keyframes nf-slide-up { from { opacity: 0; transform: translateY(20px) scale(0.98) } to { opacity: 1; transform: none } }
        .nf-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 24px 18px;
          border-bottom: 1px solid var(--header-border);
          flex-shrink: 0;
        }
        .nf-body {
          flex: 1; overflow-y: auto; padding: 24px;
          display: flex; flex-direction: column; gap: 20px;
          scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent;
        }
        .nf-section {
          display: flex; flex-direction: column; gap: 14px;
        }
        .nf-footer {
          display: flex; align-items: center; justify-content: flex-end; gap: 10px;
          padding: 16px 24px;
          border-top: 1px solid var(--header-border);
          flex-shrink: 0;
        }
        .nf-close-btn {
          width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--input-border);
          background: transparent; color: var(--label-color);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.15s; flex-shrink: 0;
        }
        .nf-close-btn:hover { background: rgba(255,255,255,0.07); color: var(--text-primary); }
        .nf-error-bar {
          margin: 0 24px;
          padding: 10px 14px; border-radius: 9px;
          background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.25);
          color: #f87171; font-size: 13px; flex-shrink: 0;
          display: flex; align-items: center; gap: 8px;
        }
        @media (max-width: 520px) {
          .nf-modal { border-radius: 16px; }
          .nf-body { padding: 16px; }
          .nf-header { padding: 16px 18px; }
          .nf-footer { padding: 14px 18px; }
        }
      `}</style>

      <div className="nf-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
        <div className="nf-modal">

          {/* Header */}
          <div className="nf-header">
            <div>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {isEdit ? 'Edit Note' : 'New Note'}
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--hint-color)' }}>
                {form.title?.trim()
                  ? form.title
                  : 'Capture what you learned, fast'}
              </p>
            </div>
            <button className="nf-close-btn" onClick={onCancel} aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Error bar */}
          {Object.keys(errors).length > 0 && (
            <div className="nf-error-bar">
              ⚠ {Object.values(errors).join(' · ')}
            </div>
          )}

          {/* Body */}
          <div className="nf-body">

            {/* Title + Category */}
            <div className="nf-section">
              <Field label="Title" required error={errors.title}>
                <Input
                  value={form.title}
                  onChange={set('title')}
                  placeholder="e.g. Frontend System Design — URL shortener"
                  error={errors.title}
                />
              </Field>

              <Field label="Category" required error={errors.category}>
                <Select
                  value={form.category}
                  onChange={set('category')}
                  options={NOTE_CATEGORIES}
                  error={errors.category}
                />
              </Field>
            </div>

            {/* Description (markdown) */}
            <MarkdownEditor value={form.description} onChange={set('description')} />

            {errors.description && (
              <span style={{ fontSize: '11px', color: '#f87171', display: 'flex', alignItems: 'center', gap: '4px' }}>
                ⚠ {errors.description}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="nf-footer">
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '9px 18px', borderRadius: '9px', border: '1px solid var(--input-border)',
                background: 'transparent', color: 'var(--label-color)',
                fontSize: '14px', fontWeight: '500', fontFamily: 'inherit', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--label-color)' }}
            >Cancel</button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              style={{
                padding: '9px 22px', borderRadius: '9px', border: 'none',
                background: 'var(--accent)', color: '#fff',
                fontSize: '14px', fontWeight: '600', fontFamily: 'inherit',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                opacity: isSaving ? 0.55 : 1,
                boxShadow: '0 2px 12px rgba(99,102,241,0.35)',
                display: 'flex', alignItems: 'center', gap: '7px',
                transition: 'all 0.15s',
              }}
            >
              {isSaving
                ? <><span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />Saving…</>
                : isEdit ? '💾 Save Changes' : '✓ Add Note'}
            </button>
          </div>

        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </>
  )
}

/* ── Single note card ── */
function NoteCard({ note, onEdit, onDelete }) {
  const cat = CATEGORY_COLORS[note.category] || CATEGORY_COLORS['Tips']
  const icon = CATEGORY_ICONS[note.category] || '📝'

  return (
    <>
      <style>{`
        .note-card {
          background: #111827;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          overflow: hidden;
          position: relative;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
          display: flex; flex-direction: column;
        }
        .note-card:hover {
          border-color: rgba(255,255,255,0.13);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          transform: translateY(-2px);
        }
        .note-card-bar {
          height: 3px;
          opacity: 0.7;
        }
        .note-card-body {
          padding: 16px 18px;
          display: flex; flex-direction: column; gap: 12px;
          flex: 1;
        }
        .note-card-top {
          display: flex; align-items: flex-start; justify-content: space-between; gap: 10px;
        }
        .note-title {
          margin: 0; font-size: 15px; font-weight: 700;
          color: #f9fafb; line-height: 1.35;
        }
        .note-card-actions { display: flex; gap: 4px; flex-shrink: 0; }
        .note-action {
          width: 28px; height: 28px; border-radius: 7px;
          border: 1px solid rgba(255,255,255,0.08);
          background: transparent; cursor: pointer; color: #6b7280;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .note-action:hover {
          background: rgba(255,255,255,0.07); color: #d1d5db;
          border-color: rgba(255,255,255,0.14);
        }
        .note-action--danger:hover {
          background: rgba(248,113,113,0.1); color: #f87171;
          border-color: rgba(248,113,113,0.2);
        }
        .note-category-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 20px;
          font-size: 11px; font-weight: 600;
          align-self: flex-start;
        }
        .note-preview {
          font-size: 13px; line-height: 1.6; color: #9ca3af;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .note-preview p { margin: 0 0 6px; }
        .note-preview p:last-child { margin-bottom: 0; }
        .note-preview h1, .note-preview h2, .note-preview h3 { color: #e5e7eb; margin: 8px 0 4px; font-size: 13px; }
        .note-preview ul, .note-preview ol { padding-left: 18px; margin: 0 0 6px; }
        .note-preview li { margin-bottom: 2px; }
        .note-preview code { background: rgba(255,255,255,0.07); padding: 1px 5px; border-radius: 4px; font-size: 12px; }
        .note-preview a { color: #6366f1; }
        .note-preview blockquote { border-left: 2px solid #6366f1; padding-left: 10px; color: #6b7280; }
      `}</style>

      <article className="note-card">
        <div className="note-card-bar" style={{ background: cat.text }} />

        <div className="note-card-body">
          {/* Top row: title + actions */}
          <div className="note-card-top">
            <h3 className="note-title">{note.title || 'Untitled note'}</h3>
            <div className="note-card-actions">
              <button className="note-action" onClick={() => onEdit(note)} title="Edit" aria-label="Edit note">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button className="note-action note-action--danger" onClick={() => onDelete(note.id)} title="Delete" aria-label="Delete note">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Category badge */}
          {note.category && (
            <span
              className="note-category-badge"
              style={{ background: cat.bg, color: cat.text, border: `1px solid ${cat.border}` }}
            >
              {icon} {note.category}
            </span>
          )}

          {/* Truncated markdown preview */}
          {note.description && (
            <div
              className="note-preview"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(note.description) }}
            />
          )}
        </div>
      </article>
    </>
  )
}

/* ── Main page ── */
export default function Notes() {
  const { notes, loading, createNote, updateNote, deleteNote } = useNotes()

  const [formOpen, setFormOpen] = useState(false)
  const [editNote, setEditNote] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [activeCat, setActiveCat] = useState('All')
  const [search, setSearch] = useState('')

  const openCreate = () => { setEditNote(null); setFormOpen(true) }
  const openEdit   = (note) => { setEditNote(note); setFormOpen(true) }
  const closeForm  = () => { setFormOpen(false); setEditNote(null) }

  const handleSave = async (formData) => {
    setIsSaving(true)
    try {
      if (editNote) {
        await updateNote(editNote.id, formData)
      } else {
        await createNote(formData)
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
    if (!window.confirm('Delete this note? This cannot be undone.')) return
    await deleteNote(id)
  }

  const counts = useMemo(() => {
    const c = { All: notes.length }
    NOTE_CATEGORIES.forEach((cat) => {
      c[cat] = notes.filter((n) => n.category === cat).length
    })
    return c
  }, [notes])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return notes.filter((n) => {
      const matchCat = activeCat === 'All' || n.category === activeCat
      const matchSearch = !q
        || n.title?.toLowerCase().includes(q)
        || n.description?.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [notes, activeCat, search])

  return (
    <>
      {formOpen && (
        <NoteForm
          initial={editNote}
          onSave={handleSave}
          onCancel={closeForm}
          isSaving={isSaving}
        />
      )}

      <style>{`
        .notes-page { display: flex; flex-direction: column; gap: 22px; }

        .notes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 14px;
        }
        @media (max-width: 480px) {
          .notes-grid { grid-template-columns: 1fr; }
        }

        .notes-filter-bar {
          display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
        }
        .notes-filter-chip {
          padding: 5px 13px; border-radius: 20px;
          border: 1.5px solid rgba(255,255,255,0.08);
          background: transparent;
          color: #6b7280; font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all .15s;
          font-family: inherit;
          display: inline-flex; align-items: center; gap: 6px;
        }
        .notes-filter-chip:hover {
          color: #d1d5db; border-color: rgba(255,255,255,0.15);
        }
        .notes-filter-chip--active {
          background: rgba(99,102,241,0.12);
          border-color: rgba(99,102,241,0.35);
          color: #818cf8;
        }
        .notes-filter-count {
          font-size: 10px; opacity: 0.7;
        }
      `}</style>

      <div className="page notes-page">

        {/* Page header */}
        <div className="page-header">
          <div>
            <p className="page-eyebrow">Preparation</p>
            <h1 className="page-title">Notes</h1>
            <p className="page-subtitle">
              {notes.length} note{notes.length === 1 ? '' : 's'} captured
              {notes.length > 0 && (
                <span style={{ color: 'var(--hint-color)', marginLeft: 6 }}>
                  · across {NOTE_CATEGORIES.filter((c) => counts[c] > 0).length} categor{counts['Tips'] + counts['Interview Questions'] + counts['Preparation Notes'] + counts['Mistakes & Learnings'] === 1 ? 'y' : 'ies'}
                </span>
              )}
            </p>
          </div>
          <button className="btn-primary" onClick={openCreate}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Note
          </button>
        </div>

        {/* Search + filter */}
        {notes.length > 0 && (
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
                placeholder="Search by title or content…"
              />
              {search && (
                <button className="search-clear" onClick={() => setSearch('')}>✕</button>
              )}
            </div>
          </div>
        )}

        {notes.length > 0 && (
          <div className="notes-filter-bar">
            <button
              className={`notes-filter-chip ${activeCat === 'All' ? 'notes-filter-chip--active' : ''}`}
              onClick={() => setActiveCat('All')}
            >
              All
              {counts.All > 0 && <span className="notes-filter-count">{counts.All}</span>}
            </button>
            {NOTE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`notes-filter-chip ${activeCat === cat ? 'notes-filter-chip--active' : ''}`}
                onClick={() => setActiveCat(cat)}
              >
                <span>{CATEGORY_ICONS[cat]}</span>
                <span>{cat}</span>
                {counts[cat] > 0 && <span className="notes-filter-count">{counts[cat]}</span>}
              </button>
            ))}
          </div>
        )}

        {/* Body */}
        {loading ? (
          <div className="card">
            <div className="empty-state">
              <div className="loading-spinner-lg" />
              <p className="empty-sub" style={{ marginTop: '16px' }}>Loading notes…</p>
            </div>
          </div>
        ) : notes.length === 0 ? (
          <div className="card">
            <div className="empty-state" style={{ padding: '4rem 2rem' }}>
              <div className="empty-icon">📝</div>
              <p className="empty-title">No notes yet</p>
              <p className="empty-sub">
                Capture interview questions, prep notes, tips, and learnings — searchable forever.
              </p>
              <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={openCreate}>
                + Add Your First Note
              </button>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card">
            <div className="empty-state" style={{ padding: '3rem 2rem' }}>
              <div className="empty-icon">🔍</div>
              <p className="empty-title">No matching notes</p>
              <p className="empty-sub">
                Try a different search term or pick another category.
              </p>
            </div>
          </div>
        ) : (
          <div className="notes-grid">
            {filtered.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
