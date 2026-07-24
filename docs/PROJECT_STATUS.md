# Amar-Career — Project Documentation

> **A personal job hunt management system built to bring order, clarity, and strategy to the job application process.**

> 📅 Document Generated: July 24, 2026
> 📌 Status: Comprehensive Review of `/c/Projects/amar-career`

---

## 📋 Executive Summary

**Amar Career** (আমার ক্যারিয়ার) is a private, single-user web application designed to organize and track the entire job-hunting workflow — from discovering opportunities and submitting applications, through interview prep, to final outcomes. The project is built as a personal productivity tool with Firebase as the database backend.

The codebase shows evidence of **active development across multiple feature areas**. Some pages are fully functional (Jobs, Companies, Dashboard, Profile), while others are clearly placeholder shells (Notes, Analytics). The architecture is clean and ready to scale.

---

## 🏗️ Tech Stack Overview

| Layer               | Technology                   | Notes                                                  |
| ------------------- | ---------------------------- | ------------------------------------------------------ |
| **Framework**       | React 19                     | Hooks-based, functional components                     |
| **Build Tool**      | Vite 8                       | Fast HMR, ESM-native bundling                          |
| **Styling**         | Tailwind CSS v4 + Custom CSS | 1,396-line design system in `index.css`                |
| **Database**        | Firebase Firestore v12       | Real-time listener-based sync                          |
| **Markdown**        | Custom regex-based renderer  | `react-markdown`/`remark-gfm` installed but **unused** |
| **Auth**            | None yet                     | Open Firestore rules (test mode)                       |
| **Deployment**      | Not configured               | `.env.example` provided for Firebase config            |
| **Package Manager** | npm                          | `package-lock.json` present                            |

### Installed but Unused Dependencies

The following packages are listed in `package.json` but have **no imports** in the source:

- `react-markdown` — Installed but a custom regex-based renderer is used in `JobForm.jsx` and `Profile.jsx`
- `react-syntax-highlighter` — Not imported anywhere
- `remark-gfm` — Not imported anywhere

> 💡 **Suggestion**: Either remove these to slim the bundle, or refactor `renderMarkdown()` in `JobForm.jsx` and `MarkdownViewer` in `Profile.jsx` to use them for proper code-block highlighting and GFM table support.

---

## ✅ What's Built (Complete & Functional)

### 1. Project Shell & Layout

**Files**: `src/App.jsx`, `src/components/Sidebar.jsx`, `src/main.jsx`, `src/index.css`

- ✅ React 19 app bootstrapped with `StrictMode` in `main.jsx`
- ✅ Custom routing via `useState` (no React Router) — `currentPage` state switches between pages
- ✅ Responsive layout: sidebar on desktop, hamburger menu + overlay on mobile
- ✅ Dark editorial design system (211+ utility/component classes in `index.css`)
- ✅ Typography: Syne (display), DM Sans (body), Noto Serif Bengali (Bengali script)
- ✅ Logo assets: `AmarCareerIcon.png` + `icon.png` in `src/assets/`
- ✅ Favicon set: `favicon_io/` contains 6 favicon variants and `site.webmanifest`
- ✅ Mobile menu (`mobile-overlay`) closes on click

**Pages Registered in Navigation** (6 total):

| ID          | Label     | Sublabel     |
| ----------- | --------- | ------------ |
| `dashboard` | Dashboard | Overview     |
| `jobs`      | Jobs      | Applications |
| `companies` | Companies | Watchlist    |
| `analytics` | Analytics | Statistics   |
| `notes`     | Notes     | Preparation  |
| `profile`   | Profile   | My Info      |

---

### 2. Dashboard Page (`src/pages/Dashboard.jsx`)

**Status**: ✅ Fully functional with real-time data

- ✅ Stats grid (4 cards): Jobs Saved, Applied, Interviews, Rejected — computed from Firestore
- ✅ Recent Applications card showing last 5 jobs with status dot + formatted date
- ✅ Pipeline Status card with horizontal bars showing distribution across all 6 statuses
- ✅ Success rate calculation (`accepted / total %`) shown conditionally
- ✅ Quick Actions row with 4 navigation buttons
- ✅ Add Job button opens `JobForm` modal in create mode
- ✅ "View all" link on Recent Applications navigates to Jobs page via prop callback
- ✅ Loading state (spinner) while Firestore loads
- ✅ Empty state with friendly onboarding

---

### 3. Jobs Page — Complete Job CRUD (`src/pages/Jobs.jsx` + `src/components/JobForm.jsx` + `src/components/JobCard.jsx`)

**Status**: ✅ Fully functional with full create/read/update/delete

#### 3a. Job List (`Jobs.jsx`)

- ✅ Add Job button → opens `JobForm` modal
- ✅ Edit Job → opens `JobForm` pre-filled with job data
- ✅ Delete Job → `window.confirm()` → permanent delete
- ✅ Status tab filters: All / Saved / Applied / Shortlisted / Interview / Rejected / Accepted (with counts per tab)
- ✅ Search bar with cross-field search:
  - jobTitle, companyName, jobType, location, notes, salary
- ✅ Loading + empty states for both "no jobs" and "no matches"
- ✅ Empty state has "Add Your First Job" CTA

#### 3b. Job Form Modal (`JobForm.jsx` — 478 lines)

- ✅ 4 grouped sections: Position / Links & Salary / CV Link / Notes
- ✅ Fields supported:
  - `jobTitle` (required), `companyName` (required)
  - `jobType` (dropdown of 8 types), `location`
  - `circularLink`, `companyWebsite`, `salary`, `cvLink`
  - `notes` (markdown editor)
- ✅ Inline validation with error styling (red border, helper text)
- ✅ Markdown editor with Edit/Preview toggle (custom `renderMarkdown` function)
- ✅ Save / Cancel buttons with `isSaving` loading spinner
- ✅ Click-outside-to-close overlay
- ✅ Mobile-responsive (grid collapses below 520px)
- ✅ Auto-generated header subtitle shows current job context

#### 3c. Job Card (`JobCard.jsx` — 382 lines)

- ✅ Left accent bar colored to current status
- ✅ Inline status badge with dropdown menu (changes status via Firestore)
- ✅ Edit (pencil) and Delete (trash) icon buttons
- ✅ Title + company display with fallback for missing values
- ✅ Badge row: job type, location, CV version link
- ✅ Chips row: salary, circular link, company website (auto-prefix `https://`)
- ✅ Notes section with markdown rendering, copy button, and "More/Less" expand toggle
- ✅ Footer with formatted creation date

#### 3d. Data Hook (`src/hooks/useJobs.js`)

- ✅ Real-time Firestore listener (`onSnapshot`) — updates UI instantly
- ✅ ISO string conversion for timestamps
- ✅ `createJob(formData)` — adds doc with `status: 'Saved'` + timestamps
- ✅ `updateJob(id, formData)` — partial update with `updatedAt` timestamp
- ✅ `updateJobStatus(id, status)` — fast status-only update
- ✅ `deleteJob(id)` — permanent delete
- ✅ Error handling with `setError`

---

### 4. Companies Watchlist Page (`src/pages/Companies.jsx` — 613 lines)

**Status**: ✅ Fully functional and the most-developed secondary feature

#### Features

- ✅ **Job Portals section** — 10 hardcoded quick-access links (BDJobs, Chakri, LinkedIn, Indeed, Glassdoor, Remotive, WeWorkRemotely, YC Jobs, AngelList, Job Circular BD)
- ✅ **Stat strip**: Companies tracked / Due for review / Never checked / Up to date
- ✅ **Add/Edit/Delete company** with full form modal (`CompanyForm`)
- ✅ **Check-in feature**: "Mark Checked" updates `lastChecked` timestamp
- ✅ **Review cycle** (7/15/30 days) with color-coded badge:
  - Red: ⚠ Check now (overdue)
  - Yellow: Due in N days
  - Green: ✓ N days left
  - Gray: Never checked
- ✅ **Search by name/tagline/notes**
- ✅ **Filter chips**: by category (Software, IT, Startup, Fintech, E-commerce, Telecom, Healthcare, NGO, MNC, Media) + by country (Bangladesh, Remote, USA, UK, Canada, Australia, Germany, Singapore, UAE, India, Other)
- ✅ **Company cards**: Logo/initials placeholder, tagline, category badge, country, review badge, notes preview (2-line clamp), Visit Website CTA
- ✅ **Three-dot menu** with Mark Checked / Edit / Delete actions
- ✅ **Empty states** with onboarding CTAs
- ✅ Mobile-responsive grids

#### Data Hook (`src/hooks/useCompanies.js`)

- ✅ Real-time Firestore listener ordered by `createdAt desc`
- ✅ `createCompany`, `updateCompany`, `deleteCompany`

---

### 5. Profile Page (`src/pages/Profile.jsx` — 355 lines)

**Status**: ✅ Mostly complete (read-only display with embedded markdown CV)

- ✅ **Hero card**: Avatar with initials, name, status badge, title, company role, location, university, links row, CGPA badge
- ✅ **Stats grid** (4 cards from `profile.stats`)
- ✅ **Custom markdown viewer** (`MarkdownViewer` component):
  - Fetches `docs/profile.md` from public folder
  - Full markdown rendering (headings, lists, blockquotes, tables, code blocks, tasks, strikethrough, images, links)
  - Preview/Raw toggle
  - Copy-to-clipboard button with confirmation
  - Loading + error states
- ✅ "View Portfolio" CTA in page header
- ⚠️ **Note**: Profile data is hardcoded in `src/data/Profile.js` — **not persisted to Firestore**. Edits would require code changes.

---

### 6. Firebase Integration (`src/firebase.js`)

- ✅ Firebase app initialized with env vars (`VITE_FIREBASE_*`)
- ✅ Firestore exported as `db`
- ✅ `.env.example` provided with all 6 required keys
- ⚠️ **No Firebase Authentication** — app is open (intended for personal/test use only)

---

### 7. Documentation Content

**Files in `docs/`** (content ready, awaiting UI integration):

- ✅ `docs/career.md` (12.7 KB) — Personal career vision, philosophy, and roadmap
- ✅ `docs/Profile.md` (17.7 KB) — Professional profile document
- ✅ `docs/profile-cv-implementation.md` (20.8 KB) — CV implementation spec
- ✅ `docs/Interview/Career_Expo.md` — Career expo notes
- ⚠️ `docs/Profile.md` exists but Profile page references `docs/profile.md` (case mismatch — fetch may 404)

---

## 🔜 What's Built But Incomplete / Placeholder

### 8. Notes Page (`src/pages/Notes.jsx` — 54 lines)

**Status**: 🟡 **Placeholder shell only** — no functionality

- ⚠️ Static category cards (Interview Questions, Preparation Notes, Mistakes & Learnings, Role-Specific Prep) with hardcoded `count: 0`
- ⚠️ "New Note" button is non-functional
- ⚠️ Search input is non-functional
- ⚠️ "All Notes" section shows permanent empty state
- ❌ No `useNotes` hook
- ❌ No notes collection in Firestore
- ❌ No note form/editor

---

### 9. Analytics Page (`src/pages/Analytics.jsx` — 50 lines)

**Status**: 🟡 **Placeholder shell only** — no functionality

- ⚠️ Success Rate and Response Rate cards show "—" placeholders
- ⚠️ "Applications by Source" empty state
- ⚠️ "Application Timeline" empty state
- ❌ No data computations from jobs
- ❌ No charts (no chart library installed)
- ❌ No date-range filtering

---

## 🚧 What's NOT Built Yet (From Roadmap)

### Phase 2 — Content Features

| Feature                            | Status       | Notes                                                               |
| ---------------------------------- | ------------ | ------------------------------------------------------------------- |
| Profile data is editable           | ❌ Not built | Profile data hardcoded in `Profile.js`; needs Firestore persistence |
| AI Analysis storage section        | ❌ Not built | Listed in README as planned feature                                 |
| CV Link tracking inside Jobs       | ⚠️ Partial   | `cvLink` field exists in form/card but no dedicated management      |
| Job Detail View (full single page) | ❌ Not built | Currently no dedicated detail route                                 |

### Phase 3 — Intelligence Features

| Feature                       | Status       | Notes                                         |
| ----------------------------- | ------------ | --------------------------------------------- |
| Application timeline chart    | ❌ Not built | Empty state on Analytics page                 |
| Success rate computation      | ⚠️ Partial   | Calculated on Dashboard, missing on Analytics |
| Source effectiveness analysis | ❌ Not built | Listed in README                              |
| Deadline calendar view        | ❌ Not built | Deadlines exist on Jobs but no calendar UI    |
| Export to CSV / PDF           | ❌ Not built | Listed in README                              |
| Response rate metric          | ❌ Not built | Empty card on Analytics                       |

### Phase 4 — Polish & Production

| Feature                          | Status       | Notes                                             |
| -------------------------------- | ------------ | ------------------------------------------------- |
| Firebase Authentication          | ❌ Not built | Currently open Firestore rules                    |
| Proper Firestore security rules  | ❌ Not built | README shows test-mode rules only                 |
| Deploy to Vercel                 | ❌ Not built | No Vercel config                                  |
| PWA support (installable)        | ⚠️ Partial   | `site.webmanifest` exists, but no service worker  |
| Dark/light mode toggle           | ❌ Not built | README mentions this                              |
| Form field coverage (per README) | ⚠️ Partial   | README documents 30+ fields, current form has ~10 |

---

## 📁 Current Project Structure

```
amar-career/
├── public/
│   └── favicon_io/                  # 6 favicon variants + site.webmanifest
├── docs/
│   ├── career.md                    # ✅ Used by Profile viewer
│   ├── Profile.md                   # ⚠️ Case mismatch with Profile.jsx fetch
│   ├── profile-cv-implementation.md
│   └── Interview/
│       └── Career_Expo.md
├── src/
│   ├── firebase.js                  # ✅ Firebase init
│   ├── main.jsx                     # ✅ React root
│   ├── App.jsx                      # ✅ Shell + routing
│   ├── index.css                    # ✅ 1,396-line design system
│   ├── assets/
│   │   ├── AmarCareerIcon.png       # Logo asset
│   │   └── icon.png                 # Sidebar logo
│   ├── data/
│   │   └── Profile.js               # ⚠️ Hardcoded profile data
│   ├── hooks/
│   │   ├── useJobs.js               # ✅ Jobs CRUD
│   │   └── useCompanies.js          # ✅ Companies CRUD
│   ├── components/
│   │   ├── Sidebar.jsx              # ✅ Navigation
│   │   ├── JobForm.jsx              # ✅ 7-section form (note: simplified)
│   │   └── JobCard.jsx              # ✅ Job list card
│   └── pages/
│       ├── Dashboard.jsx            # ✅ Fully functional
│       ├── Jobs.jsx                 # ✅ Fully functional
│       ├── Companies.jsx            # ✅ Fully functional (most-developed)
│       ├── Profile.jsx              # ✅ Mostly complete (read-only)
│       ├── Analytics.jsx            # 🟡 Placeholder
│       └── Notes.jsx                # 🟡 Placeholder
├── index.html                       # ✅ Favicons wired
├── vite.config.js                   # ✅ Tailwind + React plugins
├── eslint.config.js                 # ✅ Configured
├── package.json                     # ✅ 12 dependencies
├── .env.example                     # ✅ Firebase config template
├── .gitignore                       # ✅ Standard ignores
└── README.md                        # ✅ Comprehensive
```

---

## 🎯 Recommended Build Priority

### 🔴 High Priority (Core Value)

1. **Notes Page** — Complete the Notes feature
   - Create `src/hooks/useNotes.js` (Firestore CRUD)
   - Build note editor with category selector (markdown-friendly)
   - Add `notes` collection to Firestore
   - List view with category filtering and search
   - Link notes to specific jobs (cross-reference)

2. **Analytics Page** — Make it data-driven
   - Compute metrics from existing jobs (success rate, response rate)
   - Add chart library (e.g., Recharts or Chart.js)
   - Source effectiveness breakdown
   - Application timeline (jobs created over time)
   - Status distribution pie/bar chart

3. **Job Detail View** — Add `jobId` route/page
   - Full-page expansion of a single job
   - All sections rendered nicely
   - Edit / Status change / Notes within detail

### 🟡 Medium Priority (Quality of Life)

4. **Edit Profile Page** — Move profile from `src/data/Profile.js` to Firestore
   - Add `profile` collection (single doc)
   - Build edit form mirroring current display
   - Migrate existing data from `Profile.js`

5. **Job Form Full Coverage** — Expand form to match README's 30+ fields
   - Basic Info section (currently only Position)
   - Qualifications (education, certifications, experience, skills)
   - Compensation (salary range, type)
   - Application Process (deadline, method, documents)
   - Selection Process (screening, interview type, assessment)

6. **Deadline Tracking**
   - Sortable by deadline
   - "Expiring soon" badge on cards
   - Calendar view (month grid)

7. **Export Functionality**
   - CSV export of all jobs
   - PDF report generation

### 🟢 Low Priority (Polish)

8. **Firebase Authentication** — Google sign-in
9. **Firestore Security Rules** — Lock down to authenticated user
10. **Vercel Deployment** — Add `vercel.json` config
11. **PWA Service Worker** — Make installable
12. **Dark/Light Mode Toggle**
13. **Markdown Cleanup** — Remove unused `react-markdown`/`react-syntax-highlighter`/`remark-gfm` OR use them properly

### 🔵 Optional Improvements

14. Fix `docs/Profile.md` case mismatch (or update fetch URL)
15. Add ESLint config for tests
16. Migrate to React Router for proper URLs
17. Add unit tests (no test framework configured)
18. Add keyboard shortcuts (e.g., `n` for new job)

---

## 🧮 Codebase Metrics

| Metric                       | Count/Size                          |
| ---------------------------- | ----------------------------------- |
| Total source lines (JS/CSS)  | ~3,934                              |
| Pages                        | 6 (4 functional, 2 placeholder)     |
| Components                   | 3 (`Sidebar`, `JobForm`, `JobCard`) |
| Custom hooks                 | 2 (`useJobs`, `useCompanies`)       |
| Firestore collections in use | 2 (`jobs`, `companies`)             |
| CSS classes in design system | 211+                                |
| Hardcoded data files         | 1 (`src/data/Profile.js`)           |
| Documentation markdown files | 4 (in `docs/`)                      |

---

## ⚠️ Known Issues & Inconsistencies

1. **README claims 7-section form** — Current `JobForm.jsx` has 4 sections (Position, Links & Salary, CV Link, Notes). The README's 30+ fields are aspirational, not implemented.

2. **README claims Job data has 30+ fields** — Current form captures only ~10 fields. Missing from form (but documented in README):
   - `refCode`, `industry`, `jobSource`, `vacancies`, `responsibilities`, `kpis`, `projects`, `tools`, `education`, `certifications`, `experienceLevel`, `yearsExperience`, `industryExperience`, `technicalSkills`, `softSkills`, `languages`, `computerLiteracy`, `salaryType`, `applicationMethod`, `documentsRequired`, `applicationFormat`, `submissionLink`, `screeningSteps`, `interviewType`, `assessmentDetails`

3. **Status field is duplicated** — `Jobs.jsx` defines `STATUS_TABS` and `STATUS_COLORS` locally, same as `JobCard.jsx`. Could be extracted to `src/constants.js`.

4. **Case-sensitive file lookup** — `Profile.jsx` fetches `docs/profile.md` but the file is `docs/Profile.md` (capital P). Will 404 in production.

5. **Unused dependencies** — `react-markdown`, `react-syntax-highlighter`, `remark-gfm` are installed but never imported.

6. **No error boundary** — App will crash entirely if any component throws.

7. **`alert()` for errors** — JobForm and CompanyForm use browser `alert()` for error reporting instead of a toast system.

8. **Profile data not persisted** — Changing `Profile.js` requires code redeploy; no UI to edit it.

9. **No tests** — Zero test files, no testing library installed.

10. **Firestore open rules** — Database is publicly readable/writable (test mode). README notes this is fine for personal use.

---

## 📊 Summary Scorecard

| Area                   | Completion |
| ---------------------- | ---------- |
| Project shell & layout | 100%       |
| Firebase integration   | 100%       |
| Design system          | 95%        |
| Dashboard              | 100%       |
| Jobs CRUD              | 100%       |
| Companies Watchlist    | 100%       |
| Profile display        | 90%        |
| Notes                  | 10%        |
| Analytics              | 5%         |
| Job Detail View        | 0%         |
| Authentication         | 0%         |
| Deployment             | 0%         |
| Tests                  | 0%         |
| **Overall MVP**        | **~70%**   |

> The Jobs/Companies/Dashboard trio is production-quality for personal use. Notes and Analytics are the obvious gaps to close for an MVP. Deployment and Auth are the obvious gaps for any public release.

---

## 📝 Quick Reference: How to Run

```bash
# 1. Install
npm install

# 2. Configure Firebase
cp .env.example .env
# Fill in VITE_FIREBASE_* values from Firebase Console

# 3. Dev
npm run dev   # → http://localhost:5173

# 4. Lint
npm run lint

# 5. Build & preview
npm run build
npm run preview
```

---

_End of document._
