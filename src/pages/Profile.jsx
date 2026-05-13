const SECTIONS = [
  { icon: '🎓', title: 'Education', sub: 'Degrees, institutions, years' },
  { icon: '🛠️', title: 'Skills', sub: 'Technical & soft skills' },
  { icon: '🔗', title: 'Links', sub: 'GitHub, LinkedIn, Portfolio' },
  { icon: '📞', title: 'Contact', sub: 'Email, phone, location' },
]

export default function Profile() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Personal</p>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Your career information and personal details.</p>
        </div>
        <button className="btn-primary">Edit Profile</button>
      </div>

      {/* Profile card */}
      <div className="card profile-hero-card">
        <div className="profile-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div className="profile-info">
          <h2 className="profile-name">Your Name</h2>
          <p className="profile-role">Your Target Role · Location</p>
          <p className="profile-meta">Add your details to complete your profile →</p>
        </div>
        <div className="profile-completeness">
          <p className="completeness-label">Profile Completeness</p>
          <div className="completeness-bar-wrap">
            <div className="completeness-bar" style={{ width: '10%' }} />
          </div>
          <p className="completeness-pct">10%</p>
        </div>
      </div>

      {/* Info sections */}
      <div className="profile-sections-grid">
        {SECTIONS.map((s) => (
          <div className="card profile-section-card" key={s.title}>
            <div className="ps-icon">{s.icon}</div>
            <div className="ps-text">
              <h3 className="ps-title">{s.title}</h3>
              <p className="ps-sub">{s.sub}</p>
            </div>
            <button className="ps-add-btn">+ Add</button>
          </div>
        ))}
      </div>
    </div>
  )
}