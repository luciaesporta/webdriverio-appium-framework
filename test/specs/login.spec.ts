import LoginPage from '@pages/LoginPage';
import NavBar from '@pages/NavBar';
import { invalidEmailUser, shortPasswordUser, validUser } from '@data/users';

type Expectation =
  | { kind: 'alert'; title: string }
  | { kind: 'inline'; emailError: boolean; passwordError: boolean };

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
    expect: { kind: 'inline', emailError: true, passwordError: false },
  },
  {
    tag: '@regression',
    title: 'shows an inline error for a too-short password',
    email: shortPasswordUser.email,
    password: shortPasswordUser.password,
    expect: { kind: 'inline', emailError: false, passwordError: true },
  },
  {
    tag: '@regression',
    title: 'shows inline errors for empty credentials',
    email: '',
    password: '',
    expect: { kind: 'inline', emailError: true, passwordError: true },
  },
];

describe('Login form', () => {
  beforeEach(async () => {
    await NavBar.goTo('Login');
    await LoginPage.waitForLoaded();
  });

  for (const tc of cases) {
    it(`${tc.tag} ${tc.title}`, async () => {
      await LoginPage.login(tc.email, tc.password);

      if (tc.expect.kind === 'alert') {
        await LoginPage.waitForAlert();
        expect(await LoginPage.getAlertTitle()).toBe(tc.expect.title);
        await LoginPage.dismissAlert();
      } else {
        expect(await LoginPage.hasEmailError()).toBe(tc.expect.emailError);
        expect(await LoginPage.hasPasswordError()).toBe(tc.expect.passwordError);
      }
    });
  }
});
