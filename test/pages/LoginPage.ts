import { BasePage } from './BasePage';
import { step } from '../utils/allure';

class LoginPage extends BasePage {
  private get screen() {
    return $('~Login-screen');
  }

  private get inputEmail() {
    return $('~input-email');
  }

  private get inputPassword() {
    return $('~input-password');
  }

  private get buttonLogin() {
    return $('~button-LOGIN');
  }

  private get alertTitle() {
    return $('id=com.wdiodemoapp:id/alert_title');
  }

  private get alertOkButton() {
    return $('id=android:id/button1');
  }

  private get emailError() {
    return $('//android.widget.TextView[contains(@text,"valid email")]');
  }

  private get passwordError() {
    return $(
      '//android.widget.TextView[contains(@text,"at least") and contains(@text,"characters")]',
    );
  }

  async waitForLoaded(): Promise<void> {
    await this.waitForVisible(this.screen);
  }

  async isEmailInputDisplayed(): Promise<boolean> {
    return this.isVisible(this.inputEmail);
  }

  async isPasswordInputDisplayed(): Promise<boolean> {
    return this.isVisible(this.inputPassword);
  }

  async login(email: string, password: string): Promise<void> {
    await step(`Submit login (email=${JSON.stringify(email)})`, async () => {
      await this.waitForVisible(this.inputEmail);
      await this.inputEmail.clearValue();
      if (email) {
        await this.inputEmail.setValue(email);
      }
      await this.inputPassword.clearValue();
      if (password) {
        await this.inputPassword.setValue(password);
      }
      await this.tap(this.buttonLogin);
    });
  }

  async waitForAlert(timeout = 5_000): Promise<void> {
    await this.waitForVisible(this.alertTitle, timeout);
  }

  async getAlertTitle(): Promise<string> {
    return this.getText(this.alertTitle);
  }

  async dismissAlert(): Promise<void> {
    await step('Dismiss login alert', () => this.tap(this.alertOkButton));
  }

  async hasEmailError(): Promise<boolean> {
    return this.emailError.isExisting();
  }

  async hasPasswordError(): Promise<boolean> {
    return this.passwordError.isExisting();
  }
}

export default new LoginPage();
