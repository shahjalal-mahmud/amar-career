# Contributing

Thanks for your interest in this project. A few things to be upfront about
before you spend time on a patch:

## What this project is

Amar Career is a personal job-hunt tracker built for one author. It is
open source because the code is free to reuse, not because there is a
product roadmap or a maintainer team waiting for your pull request.

There is **no public roadmap, no contribution target, and no guarantee that
issues or PRs will be reviewed or merged quickly.** The maintainer works on
this when they have time and when the change is useful to them personally.

## If you want to use this for yourself

The recommended path:

1. Fork the repo.
2. Plug in your own Firebase config (see the README).
3. Make whatever changes you want.
4. Don't bother sending a PR unless you're fixing something genuinely wrong
   or proposing something the maintainer would also want.

That's the whole point of the MIT license.

## If you want to send a patch upstream

Small fixes are welcome: typos, clear bugs, things that break the existing
personal workflow, build/lint cleanups. Open an issue first to describe the
problem before sending a PR.

Larger changes — new pages, new collections, new dependencies, refactors of
existing flows — will almost certainly be declined. The author prefers to
keep this app small and personal.

## Style

- Match the existing code. Read a couple of files in `src/` before writing
  anything new.
- `npm run lint` and `npm run build` should pass cleanly. No new warnings.
- Do not add dependencies unless they're actually needed and you've
  explained why in the PR description.
- Do not add Firebase Authentication, security rules, or any user-management
  surface. That's explicitly out of scope (see `SECURITY.md`).

## Commit messages

Short and descriptive. Imperative mood. No need for Conventional Commits or
emoji prefixes.

## What will not be accepted

- Features that only make sense in a multi-user context (auth, sharing,
  roles, permissions).
- Deployment / CI scaffolding the maintainer doesn't need personally.
- Large refactors that touch every page for stylistic reasons.
- Adding back dependencies that were deliberately removed (e.g.
  `react-markdown`, chart libraries).

If in doubt, open an issue first.
