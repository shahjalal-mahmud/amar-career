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

## What's Deliberately Not a Phase

Do not create phases for these — they're out of scope per section 6 of `project.md`:
Authentication, production Firestore security rules, deployment config, PWA/service worker, light mode, CSV/PDF export, charts/graphs, a full Job Detail page, or CV file upload.

If a future need changes this, update `project.md` first, then add a new phase here — don't improvise scope inside a phase prompt.
