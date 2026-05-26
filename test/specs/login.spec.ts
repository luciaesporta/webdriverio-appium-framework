import LoginPage from '@pages/LoginPage';
import NavBar from '@pages/NavBar';
import {
  invalidEmailUser,
  shortPasswordUser,
  validUser,
  whitespaceEmailUser,
  whitespacePasswordUser,
} from '@data/users';

type Expectation =
  | { kind: 'alert'; title: string }
  | { kind: 'inline'; email: boolean; password: boolean };

interface LoginCase {
  tag: '@smoke' | '@regression';
  title: string;
  email: string;
  password: string;
  expect: Expectation;
}

const cases: LoginCase[] = [
  {
    tag: '@smoke',
    title: 'logs in with valid credentials',
    email: validUser.email,
    password: validUser.password,
    expect: { kind: 'alert', title: 'Success' },
  },
  {
    tag: '@regression',
    title: 'shows an inline error for an invalid email format',
    email: invalidEmailUser.email,
    password: invalidEmailUser.password,
    expect: { kind: 'inline', email: true, password: false },
  },
  {
    tag: '@regression',
    title: 'shows an inline error for a too-short password',
    email: shortPasswordUser.email,
    password: shortPasswordUser.password,
    expect: { kind: 'inline', email: false, password: true },
  },
  {
    tag: '@regression',
    title: 'rejects an email with leading or trailing whitespace as invalid format',
    email: whitespaceEmailUser.email,
    password: whitespaceEmailUser.password,
    expect: { kind: 'inline', email: true, password: false },
  },
  {
    tag: '@regression',
    title: 'accepts a password with leading or trailing whitespace literally',
    email: whitespacePasswordUser.email,
    password: whitespacePasswordUser.password,
    expect: { kind: 'alert', title: 'Success' },
  },
  {
    tag: '@regression',
    title: 'shows an inline error only on the email field when email is missing',
    email: '',
    password: validUser.password,
    expect: { kind: 'inline', email: true, password: false },
  },
  {
    tag: '@regression',
    title: 'shows an inline error only on the password field when password is missing',
    email: validUser.email,
    password: '',
    expect: { kind: 'inline', email: false, password: true },
  },
  {
    tag: '@regression',
    title: 'shows inline errors for empty credentials',
    email: '',
    password: '',
    expect: { kind: 'inline', email: true, password: true },
  },
];

describe('Login form', () => {
  beforeEach(async () => {
    await NavBar.goTo('Login');
    await LoginPage.waitForLoaded();
  });

  for (const tc of cases) {
    it(`${tc.tag} ${tc.title}`, async () => {
      if (tc.expect.kind === 'alert') {
        const title = await LoginPage.submitAndReadAlertTitle(tc.email, tc.password);
        expect(title).toBe(tc.expect.title);
        await LoginPage.dismissAlert();
      } else {
        const state = await LoginPage.submitAndReadInlineErrors(tc.email, tc.password);
        expect(state).toEqual({ email: tc.expect.email, password: tc.expect.password });
      }
    });
  }

  it('@regression closes the keyboard when pressing the Android back button', async () => {
    await LoginPage.focusEmailInput();
    await LoginPage.waitForKeyboardShown();
    expect(await browser.isKeyboardShown()).toBe(true);

    await browser.back();
    await LoginPage.waitForKeyboardHidden();
    expect(await browser.isKeyboardShown()).toBe(false);
  });

  // Skip: WDIO demo app v2.2.0 does not detect virtual fingerprint enrollment
  // on API 34 emulator (dumpsys confirms count:1 but app hides the toggle).
  // Run locally on a physical device where biometric enrollment is detected.
  it.skip('@regression shows no-biometrics-enrolled modal when toggling biometrics', async () => {
    await LoginPage.toggleBiometrics();
    await LoginPage.waitForAlert();
    const title = await LoginPage.getAlertTitle();
    expect(title).toContain('Biometrics');
    await LoginPage.dismissAlert();
  });

  it('@regression clears the inline error after resubmitting with a valid value', async () => {
    const errors = await LoginPage.submitAndReadInlineErrors(
      invalidEmailUser.email,
      invalidEmailUser.password,
    );
    expect(errors.email).toBe(true);

    const title = await LoginPage.submitAndReadAlertTitle(validUser.email, validUser.password);
    expect(title).toBe('Success');
    await LoginPage.dismissAlert();
    expect(await LoginPage.hasEmailError()).toBe(false);
  });

  it('@regression keeps the LOGIN button tappable regardless of field state', async () => {
    expect(await LoginPage.isLoginButtonEnabled()).toBe(true);

    await LoginPage.setEmail(validUser.email);
    await LoginPage.setPassword(validUser.password);
    expect(await LoginPage.isLoginButtonEnabled()).toBe(true);
  });
});
