---
name: pr-patrol
description: Reviews a branch or pull request diff against this repo's conventions and checklist, then writes a severity-rated review. Use before merging, or to review someone else's branch.
---

# pr-patrol

## Purpose
Review a diff against the standards this repo committed to, so each finding cites a rule, not a preference. Output a written, severity-rated review.

## Inputs
| Input | Default | Meaning |
|---|---|---|
| target | current branch | PR number, branch name, or base...head. |
| scope | whole diff | Restrict to given paths. |

## Workflow
1. **Gather the diff.** `gh pr diff <n>` (gh at `~/.local/bin/gh`), or `git diff <base>...<head>`. Read the full files behind the hunks.
2. **Load standards.** All of `.agents/conventions/` + `.github/pull_request_template.md`. For backend diffs, `backend/.agents/skills/` for the Prisma APIs in play.
3. **Review each applicable dimension:**
   - Correctness, including boundaries.
   - Expo: no hand-edited `ios/`/`android/`; deps via `npx expo install`; APIs checked against SDK 57 docs. [expo](../../conventions/expo.convention.md)
   - Navigation: a tab/route change is in **both** `app-tabs.tsx` and `app-tabs.web.tsx`; no non-route code in `src/app/`. [navigation](../../conventions/navigation.convention.md)
   - Theming: no hardcoded color/spacing/font; a new color is in both `light` and `dark`. [theming](../../conventions/theming.convention.md)
   - Code standards: no `any`, no silencing assertion, kebab-case files, right export kind, no stray logs. [code-standards](../../conventions/code-standards.convention.md)
   - Backend data: integer `priceCents`; schema change ships its migration; client from `generated/prisma`; indexes cover new queries. [backend-data](../../conventions/backend-data.convention.md)
   - Commits: `type(scope):`; no attribution trailer. [commits](../../conventions/commits.convention.md)
4. **Verify before reporting.** Read the path end to end; state the concrete input/state that produces the wrong result. Discard anything that fails this.
5. **Rate:** Blocking (wrong behaviour, broken invariant, exposed secret, tab/route in one platform file only) / Non-blocking / Minor (optional).
6. **Write it.** Group by severity, most severe first; each finding gives file+line, the rule, the failure, a concrete fix.

## Output
- `artifacts/pr/reviews/<descriptor>_<YYYYMMDDHHMMSS>.review.md`, path printed.
- Summary: counts by severity and whether anything blocks merge. An empty list is valid — say so.

## Rules
- Cite the convention; a finding with no rule and no demonstrated failure is Minor or nothing.
- Report what's wrong, not what the diff does. Skip pure formatting (no formatter wired in).
