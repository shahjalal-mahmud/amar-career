# Security

## No authentication by design

This application is a single-user, personal-use tool. It ships **without
Firebase Authentication** and has no concept of users, sessions, or roles.

If you clone this repo and self-host your own copy, you are responsible for
deciding who can reach the deployed app. The app itself will not gate access
for you.

## Firestore rules

The project is intended to be run against a Firestore database in **test mode**
(the default open rules Google gives you when you create a new project). Test
mode allows any client with your project credentials to read and write every
document in your database.

That is fine for:

- a private deployment you access only from your own devices
- local development
- a short-lived personal experiment

It is **not** fine for any deployment that is reachable from the public
internet without additional access controls.

If you deploy this anywhere public, you **must** add authentication and
lock down your Firestore security rules before going live. None of that ships
with this repo.

## Secrets and configuration

- `.env` is gitignored. Copy `.env.example` to `.env` and fill in your own
  Firebase project's web app config.
- Anyone who gets your `VITE_FIREBASE_*` values can read and write your
  Firestore data, as long as the project is in test mode. Treat them like
  passwords.
- Never commit a populated `.env`. The repo's `.gitignore` already excludes
  it, but double-check before pushing.

## Reporting an issue

If you find a security issue specific to this codebase, please open a private
issue or contact the maintainer directly via the GitHub profile linked in the
README. Do not post vulnerabilities as public issues until they have been
acknowledged.
