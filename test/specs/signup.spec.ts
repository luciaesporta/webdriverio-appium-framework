import SignUpPage from '@pages/SignUpPage';
import { signUpUser, mismatchedPassword } from '@data/users';

describe('Sign up form', () => {
  beforeEach(async () => {
    await SignUpPage.open();
  });

  it('@smoke registers a new user with valid credentials', async () => {
    const title = await SignUpPage.submitAndReadAlertTitle(
      signUpUser.email,
      signUpUser.password,
      signUpUser.password,
    );
    expect(title).toBe('Signed Up!');
    await SignUpPage.dismissAlert();
  });

  it('@regression shows inline error when passwords do not match', async () => {
    const errors = await SignUpPage.submitAndReadInlineErrors(
      signUpUser.email,
      signUpUser.password,
      mismatchedPassword,
    );
    expect(errors.repeatPassword).toBe(true);
  });
});
