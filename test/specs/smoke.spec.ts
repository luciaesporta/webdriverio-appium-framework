import HomePage from '../pages/HomePage.ts';
import LoginPage from '../pages/LoginPage.ts';

describe('Smoke Test - App Launch and Navigation', () => {
  it('should launch the app and show the home screen', async () => {
    // Navigate and check Home Screen
    await HomePage.waitForHomeTab();
    expect(await HomePage.isHomeTabDisplayed()).toBe(true);
  });

  it('should navigate to the Login screen and show input fields', async () => {
    // Navigate to Login Screen
    await HomePage.navigateToLogin();

    // Check Login Screen Fields
    await LoginPage.waitForEmailInput();
    expect(await LoginPage.isEmailInputDisplayed()).toBe(true);
    expect(await LoginPage.isPasswordInputDisplayed()).toBe(true);
  });
});
