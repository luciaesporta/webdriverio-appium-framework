## Summary

<!-- 1–3 bullets describing what this PR does and why. -->

## Type of change

- [ ] `feat` — new screen, gesture, or framework capability
- [ ] `fix` — bug fix, flaky test, or CI breakage
- [ ] `refactor` — code reorganization, no behavior change
- [ ] `test` — tests only
- [ ] `docs` — documentation
- [ ] `chore` — tooling, dependencies, config
- [ ] `ci` — GitHub Actions / workflow files
- [ ] `style` — formatting only

## Checklist

- [ ] `npm run verify` passes locally (typecheck, lint, format, unit, smoke)
- [ ] If this PR touches a Page Object or spec, I validated it against an emulator
- [ ] Commit messages follow [Conventional Commits](../CONTRIBUTING.md#commit-messages)
- [ ] No selectors leak into specs — all UI access goes through Page Objects

## Test plan

<!--
How did you verify this works?
- For framework / utility changes: which unit tests cover it?
- For new POMs / specs: did the smoke suite stay green? Did you run the full regression locally, or trust CI?
- For CI / tooling changes: link to the run that proves it.
-->
