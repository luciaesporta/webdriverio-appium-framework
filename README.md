# Mobile Automation Framework

[![CI](https://github.com/luciaesporta/webdriverio-appium-framework/actions/workflows/ci.yml/badge.svg)](https://github.com/luciaesporta/webdriverio-appium-framework/actions/workflows/ci.yml)
[![Allure Report](https://img.shields.io/badge/Allure-report-orange?logo=allure)](https://luciaesporta.github.io/webdriverio-appium-framework/)

End-to-end mobile automation framework for Android, built on WebdriverIO v9, Appium 3 and TypeScript using the Page Object Model. Runs locally against a Pixel 7 emulator and on every push via GitHub Actions, with Allure reports published to GitHub Pages.

## Stack

| Layer          | Choice                                                                               |
| -------------- | ------------------------------------------------------------------------------------ |
| Test runner    | [WebdriverIO](https://webdriver.io/) v9                                              |
| Mobile driver  | [Appium](https://appium.io/) 3 + UiAutomator2 v7                                     |
| Language       | TypeScript (strict mode)                                                             |
| Test framework | Mocha (BDD)                                                                          |
| Reporting      | Allure (with screenshot-on-failure attachments)                                      |
| Tooling        | ESLint flat config, Prettier, ts-node                                                |
| App under test | [WebdriverIO Native Demo App](https://github.com/webdriverio/native-demo-app) v2.2.0 |

## Project structure

```text
mobile-automation/
├── apps/                       # APK under test (gitignored)
├── config/
│   ├── wdio.shared.ts          # Framework, reporters, services, hooks
│   └── wdio.android.ts         # Android capabilities (env-driven)
├── test/
│   ├── data/
│   │   └── users.ts            # Test fixtures (typed)
│   ├── pages/
│   │   ├── BasePage.ts         # waitForVisible, tap, typeInto, getText, isVisible
│   │   ├── BaseScreen.ts       # Abstract: every screen exposes `screen` + waitForLoaded()
│   │   ├── HomePage.ts
│   │   ├── LoginPage.ts
│   │   ├── FormsPage.ts
│   │   ├── SwipePage.ts
│   │   ├── DragPage.ts
│   │   ├── WebviewPage.ts
│   │   └── NavBar.ts           # Component (extends BasePage, not BaseScreen)
│   ├── specs/                  # *.spec.ts — one per screen
│   └── utils/
│       ├── allure.ts           # step() wrapper + attachment helpers
│       └── screenshot.ts       # captureFailureArtifacts()
├── .github/workflows/ci.yml    # 3 jobs: lint, test-android, publish-allure
├── .env.example                # Local environment template
├── eslint.config.mjs
├── tsconfig.json               # strict, with @pages/@specs/@utils/@data path aliases
└── package.json
```

### Architecture

```text
              specs (test/specs/*.spec.ts)
                         │
                         ▼
               Page Objects (singletons)
              ┌───────────┴────────────┐
              ▼                        ▼
         BaseScreen                 NavBar
        (abstract)              (component)
              ▼                        ▼
                       BasePage
            (waitForVisible, tap, typeInto, …)
```

`BaseScreen` enforces a contract — every page declares `screen` (the locator that proves the screen is on top) and inherits `waitForLoaded()`. `NavBar` is a global component, not a screen, so it extends `BasePage` directly. Specs never touch raw selectors.

## Prerequisites

- Node.js 20+
- Java 21 (Temurin recommended; CI runs on Java 17 and works equally well)
- Android SDK with `ANDROID_HOME` exported and `platform-tools` on `PATH`
- An Android emulator AVD (Pixel 7 / API 34+ recommended)

## Setup

```bash
git clone https://github.com/luciaesporta/webdriverio-appium-framework.git
cd webdriverio-appium-framework
npm ci
cp .env.example .env           
```

The Appium server and the UiAutomator2 driver are bundled as dev dependencies, so no global install is needed. The APK is downloaded by CI from the `webdriverio/native-demo-app` v2.2.0 release; for local runs, drop the same `.apk` in `apps/` (or set `APK_PATH` in `.env`).

Boot your AVD before running the suite:

```bash
emulator -avd Pixel_7 &
adb wait-for-device
```

## Running tests

| Script                    | What it does                                            |
| ------------------------- | ------------------------------------------------------- |
| `npm test`                | Full suite on Android (delegates to `test:android`)     |
| `npm run test:smoke`      | Only `@smoke`-tagged tests (fast feedback)              |
| `npm run test:regression` | Only `@regression`-tagged tests                         |
| `npm run lint`            | ESLint over `test/` and `config/`                       |
| `npm run lint:fix`        | ESLint with autofix                                     |
| `npm run format`          | Prettier write                                          |
| `npm run format:check`    | Prettier check (used in CI)                             |
| `npm run typecheck`       | `tsc --noEmit`                                          |
| `npm run verify`          | typecheck + lint + format:check + smoke (pre-push gate) |
| `npm run allure:serve`    | Open the Allure report from the last run                |

### Tagging convention

Tests are tagged in their `it()` titles. `@smoke` covers the critical happy path (3 tests, ~30s). `@regression` covers field-level validation, gestures, context switching and edge cases (8 tests). Filtering uses Mocha's `--grep`:

```bash
npm run test:smoke         # mochaOpts.grep @smoke
npm run test:regression    # mochaOpts.grep @regression
```

### Coverage

| Spec                 | Tests | Tags                          | Surface area                                             |
| -------------------- | ----- | ----------------------------- | -------------------------------------------------------- |
| `app-launch.spec.ts` | 2     | `@smoke`                      | App boot, navigation                                     |
| `login.spec.ts`      | 4     | 1× `@smoke`, 3× `@regression` | Valid login, invalid email, short password, empty fields |
| `forms.spec.ts`      | 2     | `@regression`                 | Text input echo, switch toggle                           |
| `swipe.spec.ts`      | 1     | `@regression`                 | Carousel left swipe                                      |
| `drag.spec.ts`       | 1     | `@regression`                 | Native `mobile: dragGesture`                             |
| `webview.spec.ts`    | 1     | `@regression`                 | `NATIVE_APP` ↔ `WEBVIEW` context switch                  |

## Continuous Integration

Every push and pull request to `main` triggers `.github/workflows/ci.yml`, which runs three jobs:

| Job              | Purpose                                                                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `lint`           | TypeScript typecheck, ESLint, and Prettier format check.                                                                                 |
| `test-android`   | Boots an Android x86_64 emulator (API 34, Pixel 6 profile) via `reactivecircus/android-emulator-runner@v2` and runs the full WDIO suite. |
| `publish-allure` | On `main`, downloads the Allure results and deploys the generated HTML report to GitHub Pages.                                           |

Allure results, failure screenshots and the Appium log are uploaded as artifacts on every test run (kept 14 days). After each successful run on `main`, the latest report is published at `https://luciaesporta.github.io/webdriverio-appium-framework/`.

### One-time setup for forks

1. **Enable GitHub Pages**: Settings → Pages → Source: GitHub Actions.
2. **(Optional) Override the APK source**: set a repository variable `APK_DOWNLOAD_URL` (Settings → Secrets and variables → Actions → Variables) pointing to your own APK URL. The default points at the public `webdriverio/native-demo-app` v2.2.0 release.

## Extending the framework

### Adding a new screen

1. Pick the screen's accessibility id (the demo app uses `~Some-screen`).
2. Create the Page Object under `test/pages/`:

   ```ts
   import { BaseScreen } from './BaseScreen';
   import { step } from '../utils/allure';

   class SettingsPage extends BaseScreen {
     protected get screen() {
       return $('~Settings-screen');
     }

     private get notificationsToggle() {
       return $('~notifications-toggle');
     }

     async toggleNotifications(): Promise<void> {
       await step('Toggle notifications', () => this.tap(this.notificationsToggle));
     }
   }

   export default new SettingsPage();
   ```

3. Locators stay private; expose semantic actions only. Wrap user-visible actions in `step()` so they show up in the Allure timeline.

### Adding a new spec

```ts

import SettingsPage from '@pages/SettingsPage';
import NavBar from '@pages/NavBar';

describe('Settings screen', () => {
  beforeEach(async () => {
    await NavBar.goTo('Menu');
    await SettingsPage.waitForLoaded();
  });

  it('@regression toggles notifications off', async () => {
    await SettingsPage.toggleNotifications();
    // assertions…
  });
});
```

Specs only import Page Objects — never `$()` directly. Tag every `it()` with `@smoke` or `@regression`.

## Troubleshooting

### Tests pass locally but every spec fails on CI with `~Home-screen` not displayed

Symptom: the failure screenshot shows the demo app loaded behind a system dialog reading **"Pixel Launcher isn't responding"**. UiAutomator2 returns the dialog's accessibility tree, not the app's, so every `~*` locator times out.

Fix: silence Android's ANR dialogs at the system level before running the suite. The CI workflow does this with:

```bash
adb shell settings put global hide_error_dialogs 1
```

This is set both in the snapshot-creation step (so it persists in the cached AVD) and right before `npm test`.

### Appium fails to start with "driver `uiautomator2` is already installed"

The driver is bundled as a dev dependency — `npm ci` installs it. Don't run `appium driver install uiautomator2` separately; it'll error.

### `connect ECONNREFUSED 127.0.0.1:5037`

`adb` server isn't running. `adb start-server` (or just `adb devices`) wakes it up.

### Allure report doesn't update on Pages

`publish-allure` only runs on pushes to `main`. PR runs upload the results as an artifact but don't deploy.

## License

ISC. See [`package.json`](./package.json).
