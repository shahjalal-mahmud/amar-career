# Amar Career — Development Guide (development-guide.md)

> Companion to `project.md`. Feed these phases to **puku-cli** one at a time, in order.
> Each phase is scoped to be completable and testable on its own before moving to the next.
> Always attach/reference `project.md` alongside the prompt so puku-cli has the full spec, not just the phase snippet.

**Rule for every phase:** after puku-cli finishes, run `npm run dev` and manually click through the "Acceptance Check" list before starting the next phase. Don't stack unverified phases.

---

## Phase 0 — Baseline Check (do this yourself, no prompt needed)

Before starting, confirm the current state matches the audit:
- [ ] Dashboard, Jobs, Companies pages work and sync with Firestore
- [ ] Notes and Analytics are placeholders
- [ ] Profile is hardcoded in `src/data/Profile.js`
- [ ] `.env` is filled in with real Firebase config and `npm run dev` runs clean

If any of this is broken, fix it before starting Phase 1 — the later phases assume a working baseline.

---

## Phase 1 — Simplify the Job Form + Add CV Tracking

**Goal:** Bring `JobForm.jsx`, `JobCard.jsx`, and `useJobs.js` in line with section 4.1 and 5.2 of `project.md`.

### Prompt for puku-cli
```
Read project.md sections 4.1, 5.2, and 5.7 carefully before making changes.

Update the Jobs feature (src/pages/Jobs.jsx, src/components/JobForm.jsx,
src/components/JobCard.jsx, src/hooks/useJobs.js) to match this exact field set:

- jobTitle (required, text)
- companyName (required, text)
- jobType (optional, dropdown)
- location (optional, text)
- circularLink (optional, URL text input)
- cvFileName (optional, text input — a free-text label like "CV_Backend_v3.pdf",
  NOT a file upload, NOT a link — just a text field for the author to track which
  CV version they used for this job)
- details (optional, markdown textarea with the existing Edit/Preview toggle —
  this replaces the old "notes" field and is where salary, deadline,
  requirements, and anything else goes)

Remove the separate companyWebsite, salary, and cvLink fields from the form —
that information now belongs inside the "details" markdown field. Keep status,
createdAt, updatedAt as they are.

In JobCard.jsx, show cvFileName as a small labeled chip (e.g. "CV: <filename>")
when it's set, so it's easy to scan at a glance which CV version was used.

Do not add any new dependencies. Reuse the existing markdown renderer and
existing form styling classes from index.css.
```

### Acceptance Check
- [ ] Job form shows exactly the 7 fields listed above, nothing else
- [ ] `cvFileName` displays as a chip on the job card when filled in
- [ ] Old jobs with `notes`/`salary`/`cvLink` data don't crash the UI (handle gracefully or migrate field name)
- [ ] Markdown Edit/Preview toggle still works in the `details` field

---

## Phase 2 — Notes Feature (full build)

**Goal:** Replace the Notes placeholder with a real feature per section 5.5 and the `notes` model in 4.3.

### Prompt for puku-cli
```
Read project.md sections 4.3 and 5.5 carefully before making changes.

Build the Notes feature from scratch:

1. Create src/hooks/useNotes.js mirroring the pattern of useJobs.js and
   useCompanies.js: real-time onSnapshot listener on a "notes" Firestore
   collection, plus createNote, updateNote, deleteNote functions.

2. Notes model: title (string, required), description (markdown string,
   required), category (enum, required — exactly these 4 values only:
   "Tips", "Interview Questions", "Preparation Notes", "Mistakes & Learnings"),
   createdAt, updatedAt.

3. Rebuild src/pages/Notes.jsx:
   - "New Note" button opens a modal with title input, category dropdown
     (exactly the 4 fixed values), and a markdown textarea with the same
     Edit/Preview toggle pattern used in JobForm.jsx
   - List of notes, each showing title, category badge, and a truncated
     markdown preview
   - Category filter chips/tabs (reuse the Companies page's filter-chip
     visual pattern) plus an "All" option
   - Search bar filtering across title + description
   - Edit and delete on each note (delete uses window.confirm like Jobs does)
   - Loading state and empty states matching the rest of the app's conventions
     (see Jobs/Companies empty states for the pattern)

Do not add a 5th category. Do not add tags, attachments, or linking notes to
jobs — none of that is in scope. Reuse existing design system classes from
index.css; don't introduce new component libraries.
```

### Acceptance Check
- [ ] Can create a note with each of the 4 categories
- [ ] Category filter chips correctly filter the list
- [ ] Search matches on title and on description content
- [ ] Edit and delete both work and sync in real time
- [ ] Markdown preview renders correctly (headings, lists, bold, etc.)

---

## Phase 3 — Analytics Feature (simple ratios only)

**Goal:** Replace the Analytics placeholder with the metrics in section 5.4. No charts, no new libraries.

### Prompt for puku-cli
```
Read project.md section 5.4 carefully before making changes.

Rebuild src/pages/Analytics.jsx to compute the following from the existing
"jobs" collection (via useJobs.js — do not add a new hook, reuse the jobs data
already fetched there or lift it to a shared location if needed):

- Application → Interview rate: interviews / applied, as a percentage
- Interview → Acceptance rate: accepted / interview, as a percentage
- Shortlist rate: shortlisted / applied, as a percentage
- Overall success rate: accepted / total jobs, as a percentage
- Status breakdown: count of jobs per status (Saved, Applied, Shortlisted,
  Interview, Rejected, Accepted), rendered as horizontal bars using the SAME
  visual style as the existing "Pipeline Status" card on the Dashboard —
  do not invent a new chart style or add a charting library.

Handle divide-by-zero gracefully (show "—" instead of NaN/Infinity when the
denominator is 0, matching the existing Dashboard success-rate pattern).

Do not add: date-range filtering, timeline charts, source-effectiveness
breakdown, or any chart library (recharts, chart.js, etc). This page must
stay simple — a handful of percentage numbers plus one bar breakdown, nothing
more.
```

### Acceptance Check
- [ ] All four percentages compute correctly against real job data
- [ ] Zero-division cases show "—" not NaN or broken UI
- [ ] Status breakdown bars visually match the Dashboard's Pipeline Status style
- [ ] No new dependencies were added (`git diff package.json` should be empty or only show removals)

---

## Phase 4 — Profile Rework (Firestore-backed, editable, block-based)

**Goal:** Move Profile off the hardcoded `src/data/Profile.js` file and onto Firestore, editable in the UI, per section 4.4 and 5.6.

### Prompt for puku-cli
```
Read project.md sections 4.4 and 5.6 carefully before making changes.

Migrate the Profile feature from a hardcoded data file to Firestore:

1. Create src/hooks/useProfile.js:
   - Real-time listener on a "profile" collection, single doc with id "main"
     for hero info: name, title, location, links (array of {label, url}),
     avatarInitials. Provide an updateProfileMain function.
   - Real-time listener on a "profileBlocks" collection for the section
     content: section (enum: "Personal Info", "Skills", "Experience",
     "Education", "Projects", "Certifications", "Achievements"), title,
     content (markdown), order. Provide createBlock, updateBlock,
     deleteBlock, reorderBlock functions.

2. One-time migration: write a small script or inline logic to seed Firestore
   from the current src/data/Profile.js contents so existing data isn't lost,
   then note in a code comment that Profile.js can be deleted after migration
   is confirmed. Do not delete Profile.js automatically — leave that as a
   manual step for the author after they verify the migrated data.

3. Rebuild src/pages/Profile.jsx:
   - Hero card becomes editable (inline edit or an edit modal — match
     existing modal patterns from JobForm/CompanyForm)
   - Below the hero, render one section per enum value, each listing its
     blocks (title + markdown content, using the existing MarkdownViewer
     Preview/Raw pattern)
   - Add / Edit / Delete a block within a section
   - Simple up/down reordering within a section (update the "order" field)
   - A prominent "Copy All as Markdown" button that concatenates hero info +
     every section + every block's content into one markdown document and
     copies it to the clipboard (use the Clipboard API, same pattern as the
     existing copy-to-clipboard button in the current MarkdownViewer)

Do not build any CV-generation logic — copying to clipboard for the author to
paste into an external AI tool is the entire scope of this feature.
```

### Acceptance Check
- [ ] Existing profile data appears correctly after migration (nothing lost)
- [ ] Can add, edit, delete, and reorder blocks within a section
- [ ] Hero info is editable and persists
- [ ] "Copy All as Markdown" produces a clean, complete markdown document on the clipboard
- [ ] `src/data/Profile.js` is untouched (not auto-deleted) until manually confirmed

---

## Phase 5 — Polish & Cleanup

**Goal:** Fix the known issues listed in section 8 of `project.md`.

### Prompt for puku-cli
```
Read project.md section 8 carefully before making changes.

Fix the following, one at a time, verifying nothing else breaks:

1. Extract STATUS_TABS and STATUS_COLORS (currently duplicated in
   src/pages/Jobs.jsx and src/components/JobCard.jsx) into a single
   src/constants.js and import from there in both places.

2. Add a basic React ErrorBoundary component wrapping the main page content
   in App.jsx, so a crash in one page doesn't take down the whole app —
   show a simple "Something went wrong" fallback with a reload button,
   styled to match the existing design system.

3. Replace alert()-based error reporting in JobForm.jsx and CompanyForm.jsx
   with the existing inline error-styling pattern already used for field
   validation errors (red border + helper text) instead of browser alert().

4. Remove react-markdown, react-syntax-highlighter, and remark-gfm from
   package.json and run npm install to update package-lock.json, since none
   of them are imported anywhere in the codebase.

5. If any static markdown fetch still references docs/profile.md (lowercase)
   while the actual file is docs/Profile.md (capital P), fix the casing to
   match — check src/pages/Profile.jsx and anywhere else that fetches docs/*.md.

Do not touch unrelated code. Keep each fix isolated and verify the app still
runs after each one.
```

### Acceptance Check
- [ ] `grep -r "STATUS_TABS\|STATUS_COLORS" src/` shows only one definition, imported elsewhere
- [ ] Forcing an error in a page shows the ErrorBoundary fallback instead of a blank screen
- [ ] No `alert(` calls remain in `JobForm.jsx` / `CompanyForm.jsx`
- [ ] `package.json` no longer lists `react-markdown`, `react-syntax-highlighter`, `remark-gfm`
- [ ] `npm run build` completes with no errors after all changes

---

## Phase 6 — Final Closure Pass (verify the project is actually 100% done)

**Goal:** Don't just trust that Phases 1–5 worked individually — do one full pass across the whole app, catch anything that slipped through, and get a clear "done" signal before touching documentation.

### Prompt for puku-cli
```
Read project.md end to end before doing anything else — it is the single
source of truth for what "done" means for this project.

Do a full closure audit of the codebase. Do not add new features. Only find
and fix things that don't match project.md, or that are broken/inconsistent
as a result of Phases 1–5. Work through this checklist in order and report
back what you found and fixed for each item:

1. Cross-check every Firestore field actually used in code against the models
   in project.md sections 4.1–4.4 (jobs, companies, notes, profile,
   profileBlocks). Flag and fix any field name mismatch, leftover old field
   (e.g. old "notes" field on jobs vs new "details", old "cvLink" vs new
   "cvFileName"), or field referenced in code that no longer exists in the
   model.

2. Confirm src/data/Profile.js is no longer imported or read anywhere now
   that Profile is Firestore-backed. If it's unused, remove it. If anything
   still depends on it, fix that dependency to use useProfile.js instead.

3. Run through every page (Dashboard, Jobs, Companies, Analytics, Notes,
   Profile) and verify: loading state, empty state, and populated state all
   render correctly with no console errors or warnings.

4. Verify every create/edit/delete flow across all four features (Jobs,
   Companies, Notes, Profile blocks) actually persists to Firestore and
   reflects in the UI in real time without a manual refresh.

5. Verify responsive behavior at mobile width (under 520px) for every page
   and every modal — no overflow, no broken layout, hamburger menu still
   works.

6. Confirm no `alert()` calls remain anywhere in the codebase
   (grep for "alert(").

7. Confirm package.json has no unused dependencies — cross-check every
   listed dependency actually has an import somewhere in src/.

8. Run `npm run build` and `npm run lint` and fix anything either one flags.

9. Confirm nothing in the app requires authentication or references auth in
   a broken/half-built way — there should be zero auth code, per project.md
   section 6.

At the end, give me a short report: what was found, what was fixed, and
confirm explicitly whether the app now fully matches project.md with nothing
missing, nothing broken, and nothing left over from the old hardcoded/legacy
implementation.
```

### Acceptance Check
- [ ] puku-cli's closure report lists zero unresolved issues (or you've personally verified every flagged item is fixed)
- [ ] `npm run build` and `npm run lint` both pass clean
- [ ] Manually clicked through all 6 pages on both desktop and a narrow mobile width with no visual bugs
- [ ] Created, edited, and deleted at least one real item in each of Jobs / Companies / Notes / Profile blocks and confirmed it synced correctly
- [ ] `src/data/Profile.js` is either removed or confirmed genuinely unused
- [ ] Grepped the codebase yourself for `alert(` and unused deps as a final sanity check, not just trusting the report

Once this phase is checked off, the project is considered **feature-complete per project.md**. Only documentation work (Phase 7) remains.

---

## Phase 7 — Open Source Documentation Pass

**Goal:** Turn this from "a working personal app" into "a project someone can discover on GitHub, understand in two minutes, clone, and self-host" — without changing any app behavior.

This phase touches **only documentation and repo metadata files** — no `src/` changes.

### Prompt for puku-cli
```
Read project.md end to end so the documentation you write matches what is
actually built — do not describe planned/aspirational features as if they
exist, and do not describe old fields (e.g. the old 30-field job form) that
no longer exist after Phases 1–5.

This project is now genuinely open source: anyone can clone the repo, plug
in their own Firebase config, and self-host their own instance for their own
personal job hunt. It is still a single-user, no-auth, personal-use tool by
design — being open source means "you can run your own copy," not "this is
a shared multi-user product." Make sure the documentation is honest about
that distinction.

Do the following:

1. Rewrite README.md from scratch to reflect the CURRENT, ACTUALLY BUILT
   state of the app (use project.md as the source of truth for every
   feature description, every data field, and the "out of scope" list).
   Include:
   - Short intro: what the project is, why it was built (a personal job
     hunt tracker born from losing track of applications across BDJobs,
     LinkedIn, Facebook groups, etc.)
   - Feature list matching what's actually built: Dashboard, Jobs (with the
     simplified field set + cvFileName tracking), Target Companies, Notes
     (4 fixed categories), Analytics (simple ratios, no charts), Profile
     (block-based, markdown, Copy All as Markdown)
   - Tech stack table (React 19, Vite, Tailwind v4, Firebase Firestore, no
     auth, no file storage)
   - Screenshots section with placeholder image paths under a "screenshots/"
     or "docs/images/" folder and instructions for the author to drop their
     own screenshots in later
   - Full setup instructions: clone, npm install, Firebase project setup
     (Firestore only, no Storage, no Auth), copy .env.example to .env, fill
     in Firebase config, npm run dev
   - A short "Self-hosting your own copy" section explaining that since
     there's no authentication, anyone deploying this publicly is
     responsible for either keeping it private (local/personal deployment)
     or adding their own auth layer — this project intentionally does not
     include one
   - Firestore schema section matching project.md section 7 exactly
   - "Why no authentication / file storage" section explaining the free-tier,
     personal-use design decision so it doesn't read as an oversight
   - Roadmap section reflecting only what's genuinely still unbuilt per
     project.md section 6 (auth, deploy config, PWA, dark/light toggle,
     export, charts, job detail page) — clearly labeled as "intentionally
     not planned unless requirements change," not "coming soon"
   - License section referencing the new LICENSE file
   - Credits/author section

2. Add a LICENSE file at the repo root using the MIT License, since the goal
   is to let anyone freely clone, modify, and self-host their own copy.
   Fill in the current year and the author's name (ask me for the name if
   you don't have it, don't guess).

3. Add CONTRIBUTING.md. Keep it honest and short: this is primarily a
   personal tool built for one person's own workflow, so feature requests
   that don't fit the "simple personal tracker" philosophy in project.md may
   not be accepted, but bug fixes, typo fixes, and forks for personal
   customization are welcome. Briefly explain the local dev setup (already
   in README, just link to it) and a simple PR process.

4. Add a SECURITY.md that plainly states: this app has no authentication and
   uses open Firestore test-mode rules by design for personal/local use;
   anyone deploying it publicly must add their own auth and Firestore
   security rules first, and should not enter sensitive personal data
   (passwords, financial info, national ID numbers, etc.) into any field.

5. Verify .env.example exists at the repo root, lists all required
   VITE_FIREBASE_* keys with placeholder (not real) values, and is
   referenced correctly in the README setup steps. Create it if missing.

6. Add a CHANGELOG.md seeded with a single "0.1.0 — Initial public release"
   entry summarizing the features shipped through Phase 6, following the
   Keep a Changelog format.

7. Confirm .gitignore excludes .env, node_modules, and dist — add any that
   are missing.

Do not modify any file under src/. This phase is documentation and repo
metadata only.
```

### Acceptance Check
- [ ] README.md describes only real, built features — nothing aspirational is presented as done
- [ ] LICENSE file exists (MIT) with correct year and your name
- [ ] CONTRIBUTING.md exists and accurately sets expectations for a personal-first project
- [ ] SECURITY.md clearly warns about no-auth/open-rules before anyone self-hosts publicly
- [ ] .env.example exists, matches the real required Firebase keys, and contains no real secrets
- [ ] CHANGELOG.md exists with an honest 0.1.0 entry
- [ ] .gitignore correctly excludes `.env`, `node_modules`, `dist`
- [ ] Nothing under `src/` was touched in this phase — check `git diff --stat` shows only doc/root files

---

## What's Deliberately Not a Phase

Do not create phases for these — they're out of scope per section 6 of `project.md`:
Authentication, production Firestore security rules, deployment config, PWA/service worker, light mode, CSV/PDF export, charts/graphs, a full Job Detail page, or CV file upload.

If a future need changes this, update `project.md` first, then add a new phase here — don't improvise scope inside a phase prompt.