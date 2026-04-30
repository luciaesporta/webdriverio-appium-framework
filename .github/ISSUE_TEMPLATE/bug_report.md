---
name: Bug report
about: A spec is failing, the framework misbehaves, or CI is broken.
title: 'bug: '
labels: bug
assignees: ''
---

## What happened

<!-- Short description of the broken behavior. -->

## Failing test or area

<!-- e.g. `test/specs/login.spec.ts › @regression shows an inline error for an invalid email format`, or "the gestures helper", or "CI test-android job". -->

## Spec output / error

```text
<!-- Paste the WDIO spec reporter output, the Vitest failure, or the CI step error. Trim to the relevant lines. -->
```

## Environment

- Node: <!-- `node --version` -->
- OS: <!-- macOS 14, Ubuntu 22.04, … -->
- Java: <!-- `java -version` -->
- Android: <!-- AVD name, API level (or "CI emulator API 34") -->
- Appium / UiAutomator2: <!-- versions from `appium driver list --installed` -->

## Failure artifacts

<!-- For CI failures, link to the run. The workflow uploads `allure-results`, `failure-screenshots`, and `appium-log` artifacts. -->

## Steps to reproduce

1.
2.
3.

## Anything else?

<!-- Hypotheses, recent commits that touched the area, related issues, etc. -->
