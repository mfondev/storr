---
name: pr-doc-creator
description: Analyses the local changes and writes a pull request description in this repo's template format, then opens or updates the pull request assigned to its author. Use when a branch is ready to review.
---

# pr-doc-creator

## Purpose
Turn a diff into a PR description a reviewer can act on: fill every section of `.github/pull_request_template.md` and assign the PR to its author.

## Prerequisites
- `gh` on PATH (at `~/.local/bin/gh`), authenticated once with `gh auth login`.
- Branch pushed to `origin`. Never push to `main`.

## Inputs
| Input | Default | Meaning |
|---|---|---|
| base | `main` | Branch compared against. |
| PR number | none | Given → update that PR instead of creating. |
| draft | false | Open as draft. |

## Workflow
1. **Read the change.** `git diff <base>...HEAD` for content, `git log <base>..HEAD` for intent. Group by concern, not file.
2. **Read the template** headings from `.github/pull_request_template.md` (don't assume them).
3. **Draft** `What?`/`Why?`/`How?`/`Testing?` from the diff and commit bodies. For UI work add a screenshot/visible-change note; omit a section rather than writing "N/A". Deliberate follow-ups go in `Anything Else?`.
4. **Check the checklist honestly** — tick only what's true.
5. **Cross-reference** against `.agents/conventions/`; note gaps in `Anything Else?`.
6. **Write the file, then create/update the PR:**
   ```bash
   gh pr create --title "<sentence, no type(scope) prefix>" --body-file <path> --assignee @me
   gh pr edit <n> --body-file <path>
   ```
   Title is a sentence — see [commits](../../conventions/commits.convention.md).

## Output
- `artifacts/pr/<branch>_<YYYYMMDDHHMMSS>.notes.md`; the created/updated PR assigned to its author; the URL printed.

## Rules
- No filler or praise; describe what the change does and what it costs.
- Don't claim a benefit the diff doesn't deliver, never invent a test, no attribution trailer.
