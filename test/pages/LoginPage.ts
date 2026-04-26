import { BasePage } from './BasePage';
import { step } from '../utils/allure';

class LoginPage extends BasePage {
  private get inputEmail() {
    return $('~input-email');
  }

  private get inputPassword() {
    return $('~input-password');
  }

  private get buttonLogin() {
    return $('~button-LOGIN');
  }

  private get loginAlertTitle() {
    return $('//android.widget.TextView[contains(@text,"Success") or contains(@text,"Error")]');
  }

  async waitForEmailInput(): Promise<void> {
    await this.waitForVisible(this.inputEmail, 10_000);
  }

  async isEmailInputDisplayed(): Promise<boolean> {
    return this.isVisible(this.inputEmail);
  }

  async isPasswordInputDisplayed(): Promise<boolean> {
    return this.isVisible(this.inputPassword);
  }

  async login(email: string, password: string): Promise<void> {
    await step(`Submit login with email "${email}"`, async () => {
      await this.typeInto(this.inputEmail, email);
      await this.typeInto(this.inputPassword, password);
      await this.tap(this.buttonLogin);
    });
  }

  async getLoginAlertText(): Promise<string> {
    return step('Read login result alert text', () => this.getText(this.loginAlertTitle));
  }
}

export default new LoginPage();
