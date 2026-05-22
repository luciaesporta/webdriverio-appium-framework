import SignUpPage from '@pages/SignUpPage';
import { signUpUser } from '@data/users';

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
});
