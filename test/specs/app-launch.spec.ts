import HomePage from '@pages/HomePage';
import LoginPage from '@pages/LoginPage';
import NavBar from '@pages/NavBar';

describe('App launch and navigation', () => {
  it('@smoke should launch the app and show the home screen', async () => {
    await HomePage.waitForLoaded();
    expect(await HomePage.isLoaded()).toBe(true);
  });

  it('@smoke should navigate to the Login screen and show input fields', async () => {
    await NavBar.goTo('Login');
    await LoginPage.waitForLoaded();
    expect(await LoginPage.isEmailInputDisplayed()).toBe(true);
    expect(await LoginPage.isPasswordInputDisplayed()).toBe(true);
  });
});
