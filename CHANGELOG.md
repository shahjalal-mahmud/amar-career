# Changelog

All notable changes to Amar Career are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.1.0] — Initial public release

### Added

- Job tracker: add, edit, delete, search, status tabs
  (`Saved` / `Applied` / `Shortlisted` / `Interview` / `Rejected` / `Accepted`)
  with a markdown "details" dump field and a free-text CV filename label
  (`cvFileName`).
- Target Companies tracker with category, country, website, review cycle
  (7 / 15 / 30 days), check-in timestamp, and due-for-review badge.
- Notes collection with the four fixed categories
  (`Tips`, `Interview Questions`, `Preparation Notes`, `Mistakes & Learnings`)
  and markdown rendering.
- Profile page backed by Firestore: editable hero (`profile/main` doc) plus
  a `profileBlocks` collection grouped by section (Personal Info, Skills,
  Experience, Education, Projects, Certifications, Achievements), with
  per-block reorder and a "Copy All as Markdown" button.
- Dashboard with stats grid, recent applications, pipeline bars, and quick
  actions.
- Analytics page with computed ratios
  (Application → Interview, Interview → Acceptance, Shortlist, Overall
  success) and per-status counts.
- Real-time sync via Firestore `onSnapshot`.
- Inline error banners replacing browser `alert()` calls.
- One-shot legacy seed helper for the previous hardcoded profile data.

### Out of scope (intentional, see `Project.md` §6)

- Firebase Authentication.
- Custom Firestore security rules beyond test mode.
- Deployment configuration / CI.
- PWA / service worker.
- Dark / light mode toggle.
- CSV / PDF export.
- Charts / graphs.
- Job Detail full-page view.
- CV file upload / storage.
- Multi-user support.

### Notes

- This release is the first public release. The codebase has been built and
  used by one author for personal job-hunt tracking; treat it as a working
  personal tool that happens to be open source, not a maintained product.
- See `SECURITY.md` before deploying anywhere reachable from the public
  internet.

[0.1.0]: https://github.com/shahajalal-mahmud/amar-career/releases/tag/v0.1.0