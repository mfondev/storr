## What?
<!-- What changed, enough to follow without the diff. Prose, not a ticket number. -->

## Why?
<!-- The goal, and why now. -->

## How?
<!-- Decisions a reviewer should know: approach, rejected alternatives, anything that looks odd. Skip line-by-line narration. -->

## Testing?
<!-- What was verified and how: commands + results, screens/routes exercised on device/simulator/web. -->

## Screenshots (optional)
<!-- UI work: before/after of the affected screen in light and dark. -->

## Anything Else?
<!-- Follow-ups, deliberate tech debt, anything worth wider discussion. -->

## Checklist
<!-- Run the `pr-patrol` skill before requesting review. -->
- [ ] Follows the conventions in [AGENTS.md](../AGENTS.md).
- [ ] A tab/route change is in both `app-tabs.tsx` and `app-tabs.web.tsx`.
- [ ] No hardcoded colors/spacing/fonts; a new color exists in both `light` and `dark`.
- [ ] `npx expo lint` and `npx tsc --noEmit` pass (backend changes type-check and include their migration).
- [ ] No secret, token, or personal identifier logged, committed, or returned.
- [ ] Leaves the project working on its own.
