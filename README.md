# Mobile Automation Framework

[![CI](https://github.com/luciaesporta/webdriverio-appium-framework/actions/workflows/ci.yml/badge.svg)](https://github.com/luciaesporta/webdriverio-appium-framework/actions/workflows/ci.yml)
[![Allure Report](https://img.shields.io/badge/Allure-report-orange?logo=allure)](https://luciaesporta.github.io/webdriverio-appium-framework/)

A robust, scalable native mobile automation framework built with WebdriverIO, Appium, and TypeScript. This project implements the Page Object Model (POM) design pattern to ensure clean separation of concerns and highly maintainable test code.

## Tech Stack

- **Framework:** [WebdriverIO](https://webdriver.io/) (v9)
- **Mobile Driver:** [Appium](https://appium.io/) (UiAutomator2)
- **Language:** TypeScript
- **Test Runner:** Mocha
- **Design Pattern:** Page Object Model (POM)

## Project Architecture

The framework is structured to separate UI interaction logic from test assertions:

```text
mobile-automation/
├── apps/                        # Target native .apk files
├── test/
│   ├── pages/                   # Page Object classes (Locators and semantic actions)
│   │   ├── HomePage.ts
│   │   └── LoginPage.ts
│   └── specs/                   # Test scenarios and assertions
│       └── smoke.spec.ts
├── wdio.conf.ts                 # WebdriverIO and Appium configuration
└── package.json                 # Project dependencies and scripts
```

## Prerequisites

To run this project locally, ensure the following are installed and configured:

- **Node.js** (v18 or higher)
- **Java JDK** (and `JAVA_HOME` environment variable)
- **Android SDK** (and `ANDROID_HOME` environment variable)
- **Android Emulator** (configured for a standard device, e.g., Pixel 7 running Android 16)

## Installation & Execution

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Run the smoke test suite:
   ```bash
   npm run test:smoke
   ```

_Note: The Appium server is automatically managed and launched during the test execution via the `@wdio/appium-service` package._

## Best Practices Implemented

- **Total Abstraction:** Test files never interact directly with raw locators (`~accessibility_id`, `xpath`, etc.). All interactions are delegated to the dedicated Page classes.
- **Dynamic Waits:** Avoids hardcoded `sleep()` methods. All synchronization relies on built-in dynamic waits (e.g., `waitForDisplayed()`).
- **Clean Code:** Adheres to strict TypeScript rules with semantic naming conventions to ensure self-documenting test flows.

## Continuous Integration

The full suite runs on every push and pull request via GitHub Actions
(`.github/workflows/ci.yml`). The pipeline has three jobs:

| Job              | Purpose                                                                                                                                                                    |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lint`           | TypeScript typecheck, ESLint, and Prettier format check.                                                                                                                   |
| `test-android`   | Boots an Android x86_64 emulator (API 34, Pixel 6 profile) and runs the full WDIO suite. Allure results, failure screenshots and the Appium log are uploaded as artifacts. |
| `publish-allure` | On `main`, downloads the Allure results and deploys the generated HTML report to GitHub Pages.                                                                             |

### One-time setup

1. **Enable GitHub Pages**: in repository settings, navigate to **Settings → Pages** and pick **GitHub Actions** as the source.
2. **(Optional) Override the APK source**: by default the workflow downloads the public `webdriverio/native-demo-app` v2.2.0 APK (the same binary the suite is developed against locally). If you maintain your own build, set a repository variable named `APK_DOWNLOAD_URL` (Settings → Secrets and variables → Actions → Variables) pointing to your APK URL.

After the first successful run on `main`, the latest Allure report is published at:

`https://<your-username>.github.io/<repo>/`
