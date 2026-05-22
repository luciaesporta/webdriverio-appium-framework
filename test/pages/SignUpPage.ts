import { BaseScreen } from './BaseScreen';
import { step } from '../utils/allure';
import NavBar from './NavBar';

class SignUpPage extends BaseScreen {
  protected get screen() {
    return $('~Login-screen');
  }

  private get signUpTab() {
    return $('~button-sign-up-container');
  }

  private get inputEmail() {
    return $('~input-email');
  }

  private get inputPassword() {
    return $('~input-password');
  }

  private get inputRepeatPassword() {
    return $('~input-repeat-password');
  }

  private get buttonSignUp() {
    return $('~button-SIGN UP');
  }

  private get alertTitle() {
    return $('id=com.wdiodemoapp:id/alert_title');
  }

  private get alertOkButton() {
    return $('id=android:id/button1');
  }

  async open(): Promise<void> {
    await step('Open Sign Up form', async () => {
      await NavBar.goTo('Login');
      await this.waitForLoaded();
      await this.tap(this.signUpTab);
      await this.waitForVisible(this.inputRepeatPassword);
    });
  }

  async signUp(email: string, password: string, repeatPassword: string): Promise<void> {
    await step(`Submit sign up (email=${JSON.stringify(email)})`, async () => {
      await this.waitForVisible(this.inputEmail);
      await this.inputEmail.clearValue();
      if (email) {
        await this.inputEmail.setValue(email);
      }
      await this.inputPassword.clearValue();
      if (password) {
        await this.inputPassword.setValue(password);
      }
      await this.inputRepeatPassword.clearValue();
      if (repeatPassword) {
        await this.inputRepeatPassword.setValue(repeatPassword);
      }
      await this.tap(this.buttonSignUp);
    });
  }

  async submitAndReadAlertTitle(
    email: string,
    password: string,
    repeatPassword: string,
  ): Promise<string> {
    await this.signUp(email, password, repeatPassword);
    await this.waitForVisible(this.alertTitle);
    return this.getText(this.alertTitle);
  }

  async dismissAlert(): Promise<void> {
    await step('Dismiss sign up alert', () => this.tap(this.alertOkButton));
  }
}

export default new SignUpPage();
