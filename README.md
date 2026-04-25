# Mobile Automation Framework

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
