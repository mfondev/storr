# Commits convention

## Format
`type(scope): description` — **scope required**.
- `type`: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `build`, `ci`.
- `scope`: the area. App: `home`, `explore`, `navigation`, `theming`, `components`, `icons`, `app`. Backend: `backend`, `prisma`, `schema`, `server`. Cross-cutting: `repo`, `deps`, `ci`, `config`, `docs`, `agents`.
- `description`: imperative, lower case, no trailing full stop, under 72 chars.

Earlier scopeless commits (`feat:`, `chore:`) are not the standard.

## Body
Explain why, and what a reviewer should know — the behaviour that changed, not the files.

## No AI attribution trailer
Never add a `Co-Authored-By: Claude ...` or "Generated with" line to commits or PR descriptions.

## Scope
- One logical change per commit; it lints and type-checks. A schema change includes its migration.

## Branches
`type/short-description` — `feat/expiry-reminders`, `fix/web-tab-active-state`.

## Pull requests
- Work reaches `main` through a PR, not a push — even solo.
- One reviewable concern; leaves the project working on its own.
- Description follows `.github/pull_request_template.md` (use the `pr-doc-creator` skill).
- **Title is a sentence, not a commit subject:** imperative, sentence case, no `type(scope):` prefix.
- Before opening: run lint + typecheck, sweep the diff against these conventions (`pr-patrol` skill), update any doc the change affects.
