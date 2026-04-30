# Contributing

Thanks for your interest in contributing. This is a small portfolio project, but the same conventions apply as for any production framework.

## Setup

See [`README.md`](./README.md#setup) for the full local setup. In short: `npm ci`, copy `.env.example` to `.env`, boot an Android AVD.

## Workflow

1. Branch off `main`: `git checkout -b <type>/<short-description>` (e.g. `feat/add-settings-screen`).
2. Make focused commits — one logical change per commit.
3. Run `npm run verify` before pushing. It chains typecheck, lint, format check, unit tests, and the smoke suite.
4. Push and open a PR against `main`.
5. CI must be green before merge: `lint` (typecheck + ESLint + Prettier + Vitest unit tests) and `test-android` (full WDIO suite on an emulator).

Prefer small PRs. The project's commit history is one logical change per commit, one commit per PR — keep that pattern unless there's a strong reason to bundle.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/) with the scopes already in use:

| Type       | Use for                                                            | Example                                                              |
| ---------- | ------------------------------------------------------------------ | -------------------------------------------------------------------- |
| `feat`     | A new screen, gesture, or framework capability                     | `feat(pom): add SettingsPage with notification toggle`               |
| `fix`      | Bug fix — usually a flaky test, a wrong selector, or a CI breakage | `fix(webview): wait for WEBVIEW context instead of native screen id` |
| `refactor` | Code reorganization without behavioral change                      | `refactor(config): split Android wdio config into local and ci`      |
| `test`     | Adding or modifying tests                                          | `test(unit): add Vitest unit suite for gesture helpers`              |
| `docs`     | README, CONTRIBUTING, JSDoc                                        | `docs: embed Allure report preview at top of README`                 |
| `chore`    | Maintenance: dependencies, config files, tooling                   | `chore(tsconfig): drop orphan @fixtures path alias`                  |
| `ci`       | GitHub Actions, workflow files                                     | `ci: suppress system ANR dialogs that block accessibility tree`      |
| `style`    | Formatting / whitespace only — no semantics change                 | `style: remove extra blank line in WebviewPage`                      |

Subject line should be ≤ 72 characters, imperative mood, no trailing period.

## Code style

- TypeScript strict mode is mandatory. The tsconfig enforces `noUnusedLocals`, `noUnusedParameters`, and `noImplicitReturns`.
- ESLint and Prettier are wired up. Run `npm run lint:fix` and `npm run format` before committing if needed.
- Specs never reference selectors directly — always go through a Page Object.
- Page Objects keep their locators private and expose semantic actions (see [`README.md` › Extending the framework](./README.md#extending-the-framework)).
- Wrap user-visible actions in `step()` from `test/utils/allure.ts` so they appear in the Allure timeline.

## Testing

| Layer      | Where                  | When to add                                                                                                      |
| ---------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Unit tests | `test/utils/*.test.ts` | Whenever you add or change framework helpers (gestures, screenshot, …). Mocks `browser`. Runs under Vitest.      |
| E2E tests  | `test/specs/*.spec.ts` | Whenever you add or change a Page Object or behavioral surface. Runs under WDIO + Mocha against a real emulator. |

Tag every E2E `it()` block with `@smoke` (critical happy path) or `@regression` (validation, gestures, edge cases). Tag selection is done via `mochaOpts.grep`.

## Adding a new screen

See [`README.md` › Adding a new screen](./README.md#adding-a-new-screen). The short version:

1. Create `test/pages/YourPage.ts` extending `BaseScreen`.
2. Declare `protected get screen()` returning the locator that proves the screen is on top.
3. Keep other locators private; expose semantic actions wrapped in `step()`.
4. Export a singleton: `export default new YourPage();`.
5. Add `test/specs/your-page.spec.ts` that imports the singleton and uses it through `NavBar` and the page's public methods.

## Reporting issues

Use the issue templates in `.github/ISSUE_TEMPLATE/`. For bugs, include the failing test name, the spec output, and (if applicable) the screenshot from the failure artifacts.
