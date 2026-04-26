import HomePage from '@pages/HomePage';
import LoginPage from '@pages/LoginPage';

describe('Smoke - app launch and navigation', () => {
  it('should launch the app and show the home screen', async () => {
    await HomePage.waitForHomeTab();
    expect(await HomePage.isHomeTabDisplayed()).toBe(true);
  });

  it('should navigate to the Login screen and show input fields', async () => {
    await HomePage.navigateToLogin();
    await LoginPage.waitForEmailInput();
    expect(await LoginPage.isEmailInputDisplayed()).toBe(true);
    expect(await LoginPage.isPasswordInputDisplayed()).toBe(true);
  });
});
