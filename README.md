# Amar Career

> আমার ক্যারিয়ার — a personal job-hunt tracker.

A small, single-user web app for tracking job applications, target companies,
interview notes, and a personal profile you can paste into an AI to draft a
tailored CV.

Built for one person (the author). Open source under MIT so anyone can clone
it, plug in their own Firebase config, and run their own copy for their own
job hunt.

It is **not** a multi-user SaaS, **not** a hosted product, and **not** an ATS
in the conventional sense.

---

## Table of contents

- [Amar Career](#amar-career)
  - [Table of contents](#table-of-contents)
  - [What it does](#what-it-does)
  - [What it deliberately does not do](#what-it-deliberately-does-not-do)
  - [Tech stack](#tech-stack)
  - [Quick start](#quick-start)
  - [Firestore setup](#firestore-setup)
    - [Optional: seed legacy profile data](#optional-seed-legacy-profile-data)
  - [Project structure](#project-structure)
  - [Data model](#data-model)
  - [Scripts](#scripts)
  - [Self-hosting notes](#self-hosting-notes)
  - [Security](#security)
  - [Contributing](#contributing)
  - [License](#license)

---

## What it does

Six pages, each doing one job:

- **Dashboard** — quick stats, last 5 applications, pipeline breakdown, quick
  actions.
- **Jobs** — every application you've saved. Filter by status, search across
  fields. Per-job card shows status, type, location, the CV filename you used,
  the original circular link, and a markdown "details" dump for everything
  else (salary, deadlines, requirements, follow-ups, anything).
- **Target Companies** — places you want to check regularly for new postings.
  Each entry has a category, country, website, a review cycle (7 / 15 / 30
  days), and a "Mark Checked" button that updates a `lastChecked` timestamp.
  A badge tells you when it's due for a re-check.
- **Notes** — a small markdown notebook with four fixed categories:
  _Tips_, _Interview Questions_, _Preparation Notes_, _Mistakes & Learnings_.
  Search across title and content.
- **Profile** — a personal knowledge base. Editable hero info plus a list of
  blocks grouped by section (Personal Info, Skills, Experience, Education,
  Projects, Certifications, Achievements). Each block is a title plus
  markdown content. A **Copy All as Markdown** button flattens everything
  into a single document and copies it to your clipboard, ready to paste
  into an AI chat when you want to draft a role-specific CV.
- **Analytics** — four ratios and a per-status count breakdown. No graphs,
  no date filters. Just numbers.

Real-time sync across tabs via Firestore `onSnapshot`. No manual refresh.

## What it deliberately does not do

This is a personal tool, kept small on purpose. Out of scope:

- **No authentication.** See [Security](#security).
- **No multi-user support.** Single-user by design.
- **No CV file upload.** The `cvFileName` field on a job is a free-text label
  (e.g. `CV_Backend_v3.pdf`) you match against files you keep locally or in
  Google Drive. The app never sees the file.
- **No charts, no graphs, no PDF / CSV export.**
- **No PWA / service worker / offline mode.**
- **No light theme.** Dark only.
- **No deployment configuration in this repo.** Clone it, run it locally, or
  deploy the `dist/` build yourself however you like.

The full list of intentional non-features lives in [`Project.md`](./Project.md) §6.

## Tech stack

| Layer     | Choice                                                       |
| --------- | ------------------------------------------------------------ |
| Framework | React 19 (functional components, hooks only)                 |
| Build     | Vite 8                                                       |
| Styling   | Tailwind CSS v4 + a small custom dark design system in CSS   |
| Routing   | `useState`-based page switching (no React Router)            |
| Database  | Firebase Firestore v12, real-time via `onSnapshot`           |
| Storage   | None                                                         |
| Auth      | None                                                         |
| Markdown  | Small custom regex renderer (no `react-markdown` dependency) |

Only five runtime dependencies: `@tailwindcss/vite`, `firebase`, `react`,
`react-dom`, `tailwindcss`.

## Quick start

Requirements: **Node.js 20+** and **npm**.

```bash
# 1. Clone
git clone https://github.com/shahajalal-mahmud/amar-career.git
cd amar-career

# 2. Install
npm install

# 3. Configure Firebase (see next section)
cp .env.example .env
# …edit .env with your Firebase web-app config…

# 4. Run the dev server
npm run dev
```

Open <http://localhost:5173>.

## Firestore setup

You'll need a Firebase project. If you don't already have one:

1. Go to <https://console.firebase.google.com> and create a project.
2. In **Build → Firestore Database**, create a database. The default
   **test mode** is fine for personal / local use (read [Security](#security)
   before deploying anywhere public).
3. In **Project settings → General → Your apps**, register a **Web app**.
4. Copy the `firebaseConfig` object into your `.env` file using the keys
   from `.env.example`:

   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   VITE_FIREBASE_MEASUREMENT_ID=...
   ```

5. Restart `npm run dev` after editing `.env`.

The app will create the collections it needs (`jobs`, `companies`, `notes`,
`profile/main`, `profileBlocks`) on first write.

### Optional: seed legacy profile data

If you're migrating from the old hardcoded profile (`src/data/Profile.js`),
open the **Profile** page, click **Seed from old data**, then delete
`src/data/Profile.js` and `src/utils/migrateProfile.js` once you're happy
with the result. That path is a one-shot migration helper, not a permanent
feature.

## Project structure

```
src/
  App.jsx                # page-switching shell + error boundary
  main.jsx               # React entry point
  firebase.js            # Firestore init
  constants.js           # STATUS_TABS, STATUS_COLORS, statusStyle()
  index.css              # Tailwind + design system + responsive rules
  components/
    JobCard.jsx          # single job card with status dropdown
    JobForm.jsx          # add/edit job modal
    Sidebar.jsx          # desktop + mobile nav
    SaveErrorOverlay.jsx # inline save-error banner
    ErrorBoundary.jsx    # per-page crash boundary
  hooks/
    useJobs.js           # jobs collection + CRUD + status updates
    useCompanies.js      # companies collection + CRUD + check-in
    useNotes.js          # notes collection + CRUD
    useProfile.js        # profile/main doc + profileBlocks CRUD
  pages/
    Dashboard.jsx
    Jobs.jsx
    Companies.jsx
    Notes.jsx
    Profile.jsx
    Analytics.jsx
  utils/
    markdown.js          # tiny regex-based markdown renderer
    migrateProfile.js    # one-shot legacy profile seeder
  data/
    Profile.js           # legacy hardcoded profile (delete after seeding)
```

## Data model

The single source of truth is [`Project.md`](./Project.md). Quick summary:

```
jobs/{jobId}
  jobTitle, companyName, jobType, location, circularLink,
  cvFileName, details (markdown), status,
  createdAt, updatedAt

companies/{companyId}
  name, website, category, country, notes,
  lastChecked, reviewCycle (7|15|30), createdAt, updatedAt

notes/{noteId}
  title, description (markdown), category (4 fixed values),
  createdAt, updatedAt

profile/main
  name, title, location, links[], avatarInitials

profileBlocks/{blockId}
  section (7 fixed values), title, content (markdown), order,
  createdAt, updatedAt
```

Statuses (jobs): `Saved` → `Applied` → `Shortlisted` → `Interview` → `Rejected` / `Accepted`.

Note categories: `Tips`, `Interview Questions`, `Preparation Notes`,
`Mistakes & Learnings`. These are intentionally fixed — see Project.md §4.3.

Profile sections: `Personal Info`, `Skills`, `Experience`, `Education`,
`Projects`, `Certifications`, `Achievements`.

## Scripts

```bash
npm run dev      # Vite dev server on :5173
npm run build    # production build into dist/
npm run preview  # serve the production build locally
npm run lint     # ESLint over the whole project
```

## Self-hosting notes

This repo only contains the source. To put a copy on the public internet
you'd need to:

1. `npm run build` to produce `dist/`.
2. Host `dist/` somewhere static (any static host works — Netlify, Vercel,
   Cloudflare Pages, GitHub Pages, an Nginx box, etc.). Configuration for
   that is **not** included in this repo.
3. **Add your own auth and lock down your Firestore rules before going
   public.** The default test-mode rules allow anyone with your Firebase
   config to read and write your entire database. See [Security](#security).

## Security

Read [`SECURITY.md`](./SECURITY.md) before deploying this anywhere. The
short version:

- There is **no authentication** in this app. It is built for one user.
- Firestore is intended to be used in **test mode** for personal use.
- If you deploy this publicly without adding your own auth and rules, your
  data is effectively public.
- Never commit `.env`. It's already in `.gitignore`.

## Contributing

This is a personal project. Read [`CONTRIBUTING.md`](./CONTRIBUTING.md)
before sending anything. The TL;DR is: fork it for your own use, send small
fixes upstream if you find something genuinely broken, don't expect a fast
review.

## License

MIT — see [`LICENSE`](./LICENSE).

Copyright (c) 2026 Md Shahajalal Mahmud.

You are free to clone, modify, and run your own copy, including for
commercial purposes. Attribution is appreciated but not required beyond
keeping the copyright notice in substantial copies of the source.
