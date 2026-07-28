# Amar Career — Project Specification (project.md)

> আমার ক্যারিয়ার — a personal job-hunt tracker.
> Single-user. Open source. No complexity for complexity's sake.

This document is the single source of truth for what Amar Career is and how it should behave. Any implementation work (via puku-cli or otherwise) should follow this spec exactly. If something is not written here, it is **out of scope** until this file is updated.

---

## 1. Why This Project Exists

The author was applying to many jobs across scattered sources (BDJobs, LinkedIn, Facebook groups/pages, company career pages) and lost track of:

- Which jobs were already applied to (duplicate applications, confusion)
- What stage each application was in
- Which CV version was sent for which job
- Which companies/pages were worth checking regularly for new postings
- Personal career info scattered across old CVs, hard to reuse when writing a new customized CV for a specific role

There is no single tool in Bangladesh that unifies job tracking across these scattered sources. Amar Career is a small, personal system to solve exactly this — not a generic ATS, not a public SaaS product.

---

## 2. Core Principles (read this before adding any feature)

1. **Personal use first.** Built for one user (the author). No multi-tenant thinking, no auth complexity, no permission systems.
2. **Simple over complete.** Prefer 4–6 clear input fields + one markdown "dump" field over 30 granular fields. If information doesn't need to be searched/filtered/sorted on, it belongs in markdown, not a dedicated field.
3. **Free tier only.** Firebase Firestore free tier. No Firebase Storage (file uploads), no paid services, no chart libraries unless truly necessary.
4. **No authentication.** This is intentional, not a gap. The app is meant to be run locally or deployed privately by whoever clones it. (Anyone who forks this for their own public deployment is responsible for adding their own auth — not this project's concern.)
5. **Markdown is the escape hatch.** Anywhere information is rich, variable, or unpredictable (job requirements, interview notes, CV content, company notes), use a markdown textarea instead of inventing new structured fields.
6. **CV files are never uploaded.** Only the _filename/label_ of the CV version is stored as text, so the author can match it to the actual file sitting locally on their machine or in Google Drive.

---

## 3. Tech Stack

| Layer              | Technology                                         | Notes                                                                                                                                                                         |
| ------------------ | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework          | React 19                                           | Functional components, hooks only                                                                                                                                             |
| Build tool         | Vite 8                                             |                                                                                                                                                                               |
| Styling            | Tailwind CSS v4 + custom `index.css` design system | Keep existing dark editorial design system, reuse existing utility classes                                                                                                    |
| Routing            | `useState`-based page switching (no React Router)  | Keep as-is — no need to add a router for a 6-page app                                                                                                                         |
| Database           | Firebase Firestore v12                             | Real-time via `onSnapshot`                                                                                                                                                    |
| File storage       | **None**                                           | CVs are never uploaded; only filenames are stored as text                                                                                                                     |
| Markdown rendering | Existing custom regex-based renderer               | Reuse the renderer already used in `JobForm.jsx` / `Profile.jsx`. Do not add `react-markdown` usage unless the custom renderer breaks on something real (tables, code blocks) |
| Auth               | None                                               | Intentional — see Core Principles                                                                                                                                             |
| Charts             | None                                               | Analytics is a handful of percentages, not graphs                                                                                                                             |

### Dependency cleanup

`react-markdown`, `react-syntax-highlighter`, and `remark-gfm` are installed but unused. **Remove them** from `package.json` unless a specific feature in this doc calls for real GFM/code-highlighting support. Do not silently keep dead dependencies.

---

## 4. Data Models (Firestore Collections)

### 4.1 `jobs`

The job form must stay to **5 core fields + 1 markdown field + 1 CV tracking field**. Do not expand this into a 30-field form. Anything not listed as a "core field" goes into `details` (markdown).

| Field          | Type              | Required | Notes                                                                                                                                                                                            |
| -------------- | ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `jobTitle`     | string            | ✅       |                                                                                                                                                                                                  |
| `companyName`  | string            | ✅       |                                                                                                                                                                                                  |
| `jobType`      | string (dropdown) | optional | e.g. Full-time, Part-time, Internship, Remote, Contract                                                                                                                                          |
| `location`     | string            | optional |                                                                                                                                                                                                  |
| `circularLink` | string (URL)      | optional | Link to the original job posting                                                                                                                                                                 |
| `cvFileName`   | string            | optional | Free-text label of the CV version submitted for this job, e.g. `CV_Backend_v3.pdf`. **No file upload — this is a label only**, matched manually against files the author keeps locally/in Drive. |
| `details`      | string (markdown) | optional | Free-form dump for everything else: salary, deadline, requirements, responsibilities, how it was applied, interview notes, follow-ups, anything                                                  |
| `status`       | enum              | auto     | `Saved` (default) → `Applied` → `Shortlisted` → `Interview` → `Rejected` / `Accepted`                                                                                                            |
| `createdAt`    | timestamp         | auto     |                                                                                                                                                                                                  |
| `updatedAt`    | timestamp         | auto     |                                                                                                                                                                                                  |

The Firestore auto-generated document ID **is** the "unique job ID" — no need to generate a separate custom ID field.

### 4.2 `companies` (Target Companies)

Keep the already-built model — it matches the intended use ("companies or platforms to check weekly for new postings"):

| Field               | Type          | Notes                                             |
| ------------------- | ------------- | ------------------------------------------------- |
| `name`              | string        | Company or platform name                          |
| `website`           | string (URL)  |                                                   |
| `category`          | string        | optional tag                                      |
| `country`           | string        | optional tag                                      |
| `tagline` / `notes` | string        | short note about why it's being tracked           |
| `lastChecked`       | timestamp     | updated by "Mark Checked"                         |
| `reviewCycle`       | number (days) | 7 / 15 / 30 — determines the due-for-review badge |
| `createdAt`         | timestamp     |                                                   |

No changes required here beyond what's already implemented.

### 4.3 `notes`

New collection — currently a placeholder in the codebase.

| Field         | Type              | Required | Notes                                                                    |
| ------------- | ----------------- | -------- | ------------------------------------------------------------------------ |
| `title`       | string            | ✅       |                                                                          |
| `description` | string (markdown) | ✅       | The entire content of the note — interview Q&A, tips, mistakes, whatever |
| `category`    | enum              | ✅       | Fixed set, exactly 4 values — see below                                  |
| `createdAt`   | timestamp         | auto     |                                                                          |
| `updatedAt`   | timestamp         | auto     |                                                                          |

**Fixed categories (exactly these 4, no more):**

1. `Tips`
2. `Interview Questions`
3. `Preparation Notes`
4. `Mistakes & Learnings`

Do not add a 5th category or make categories user-editable. If the author wants a new category later, it's a spec change, not a runtime feature.

### 4.4 `profile`

Currently hardcoded in `src/data/Profile.js`. Must move to Firestore so it's editable from the UI.

Model as a **collection of profile blocks**, not one giant document — this mirrors the Notes pattern and lets the author freely add/remove sections without a fixed shape.

Collection: `profileBlocks`

| Field                     | Type              | Notes                                                                                              |
| ------------------------- | ----------------- | -------------------------------------------------------------------------------------------------- |
| `section`                 | enum              | `Personal Info`, `Skills`, `Experience`, `Education`, `Projects`, `Certifications`, `Achievements` |
| `title`                   | string            | e.g. "Backend Developer @ XYZ Corp", "React"                                                       |
| `content`                 | string (markdown) | The actual content — dates, bullet points, descriptions, all markdown                              |
| `order`                   | number            | For manual sort within a section                                                                   |
| `createdAt` / `updatedAt` | timestamp         |                                                                                                    |

Plus one small fixed-shape doc for hero info (single Firestore doc, id `main`):

Collection: `profile`, doc `main`
| Field | Type |
|---|---|
| `name` | string |
| `title` | string |
| `location` | string |
| `links` | array of `{label, url}` |
| `avatarInitials` | string |

**Why this shape:** the author's actual workflow is "dump everything about myself, then copy relevant pieces into an AI to generate a role-specific CV." Blocks that can be freely added, edited, reordered, and removed support that far better than a fixed schema.

---

## 5. Pages & Feature Specs

### 5.1 Dashboard — ✅ already built, no changes needed

Stats grid (Jobs Saved / Applied / Interviews / Rejected), Recent Applications (last 5), Pipeline Status bars, Quick Actions, Add Job modal trigger. Keep as-is.

### 5.2 Jobs — mostly built, needs simplification + CV field

- Keep: list, status tabs, search, edit/delete, real-time sync.
- **Change the form** (`JobForm.jsx`) to match the 4.1 model exactly: `jobTitle`, `companyName`, `jobType`, `location`, `circularLink`, `cvFileName`, `details` (markdown, replaces the current `notes` field name — same idea, renamed/expanded to be the general dump). Remove `companyWebsite`, `salary`, `cvLink` as separate fields — salary and CV link now live inside `details` markdown, since the CV **file** isn't being tracked as a link, but `cvFileName` is a distinct, dedicated field (see 5.6).
- Job card should show `cvFileName` clearly (e.g. a small chip "CV: CV_Backend_v3.pdf") since this was one of the two original motivating problems.

### 5.3 Target Companies — ✅ already built, no changes needed

Keep exactly as documented in the audit: job portals shortcuts, review cycle badges, check-in, search/filter, CRUD.

### 5.4 Analytics — needs to be built (currently 5% / placeholder)

Keep this **simple** — ratios only, no charts, no chart library:

- **Application → Interview rate**: `interviews / applied %`
- **Interview → Acceptance rate**: `accepted / interview %`
- **Shortlist rate**: `shortlisted / applied %`
- **Overall success rate**: `accepted / total applied %`
- **Status breakdown**: simple counts per status (reuse the same horizontal bar style already used in Dashboard's Pipeline Status card — don't invent a new chart component)
- All computed client-side from the existing `jobs` collection — no new Firestore fields needed.
- No date filtering, no timeline, no source-effectiveness breakdown for now — explicitly out of scope until asked for.

### 5.5 Notes — needs to be built (currently placeholder)

- List view grouped/filterable by the 4 fixed categories (5.3 in data model — `Tips`, `Interview Questions`, `Preparation Notes`, `Mistakes & Learnings`)
- "New Note" opens a small modal: `title` (text input) + `category` (dropdown, 4 fixed options) + `description` (markdown textarea with the same Edit/Preview toggle pattern used in `JobForm.jsx`)
- Search across `title` + `description`
- Edit / Delete on each note
- Category filter chips/tabs (reuse the Companies page's filter-chip pattern)
- Empty states per existing app conventions

### 5.6 Profile — needs rework (currently hardcoded, read-only)

Purpose: a personal knowledge base the author copies from to manually generate role-specific CVs via an external AI tool. **CV generation itself is not part of this app.**

- Hero section (name, title, location, links, avatar initials) — editable, backed by `profile/main` doc
- Below the hero: sections for each `section` enum value (`Personal Info`, `Skills`, `Experience`, `Education`, `Projects`, `Certifications`, `Achievements`), each showing its list of blocks
- Add / Edit / Delete a block within a section (title + markdown content)
- Reorder blocks within a section (simple up/down or drag, keep it simple — up/down buttons are enough)
- **"Copy All as Markdown" button** — concatenates the entire profile (hero + all sections + all blocks) into one markdown document and copies it to clipboard, ready to paste into an AI chat. This directly supports the author's stated CV workflow and should be treated as a first-class feature, not an afterthought.
- Preview/Raw toggle per block, same pattern as existing `MarkdownViewer`

### 5.7 CV Tracking (cross-cutting concern, not a separate page)

- Solves: "too many CV versions, hard to remember which one went to which job."
- Implementation: the `cvFileName` text field on each Job (4.1) **is** the whole feature. No separate CV collection, no file upload, no versioning system.
- The Firestore document ID of the job **is** the unique job ID; no custom ID generation needed.
- Convention (documented for the author, not enforced by code): name CV files consistently, e.g. `CV_<RoleType>_v<N>.pdf`, kept locally / in Drive, and just type that filename into the job's `cvFileName` field.

---

## 6. Explicitly Out of Scope (for this build)

These appear in the old README/roadmap but are **not** part of this spec and should not be built unless this document is updated:

- Firebase Authentication
- Firestore security rules beyond test mode (fine for personal/private use)
- Deployment configuration (Vercel etc.) — author will handle deployment separately if/when needed
- PWA / service worker
- Dark/light mode toggle (the app is dark-only by design)
- CSV/PDF export
- Charts/graphs of any kind
- Job Detail full-page view (the card + modal pattern is sufficient)
- CV file upload/storage
- Multi-user support of any kind

---

## 7. Firestore Structure Summary

```
jobs/{jobId}
  jobTitle, companyName, jobType, location, circularLink,
  cvFileName, details, status, createdAt, updatedAt

companies/{companyId}
  name, website, category, country, notes,
  lastChecked, reviewCycle, createdAt

notes/{noteId}
  title, description, category, createdAt, updatedAt

profile/main
  name, title, location, links[], avatarInitials

profileBlocks/{blockId}
  section, title, content, order, createdAt, updatedAt
```

No auth, no security rules beyond default test mode.

---

## 8. Known Issues Carried Over From Audit (fix during this build)

1. `Profile.jsx` fetches `docs/profile.md` but the file is `docs/Profile.md` — fix the case mismatch (moot once profile moves to Firestore, but fix if any static markdown fetch remains, e.g. for `career.md`).
2. `STATUS_TABS` / `STATUS_COLORS` duplicated in `Jobs.jsx` and `JobCard.jsx` — extract to `src/constants.js`.
3. No error boundary — app crashes fully on any component error. Add one basic `ErrorBoundary` around the page content.
4. `alert()` used for form errors in `JobForm.jsx` / `CompanyForm.jsx` — replace with the existing inline error-styling pattern already used for field validation (no new toast library needed).
5. Remove unused dependencies (`react-markdown`, `react-syntax-highlighter`, `remark-gfm`) from `package.json`.

---

_This spec supersedes the old README roadmap wherever they conflict. Keep this file updated as the single source of truth._
