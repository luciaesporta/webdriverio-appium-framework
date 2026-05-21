import { BaseScreen } from './BaseScreen';
import { step } from '../utils/allure';
import { tapAt } from '../utils/gestures';

class LoginPage extends BaseScreen {
  protected get screen() {
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

  async submitAndReadAlertTitle(email: string, password: string): Promise<string> {
    await this.login(email, password);
    await this.waitForAlert();
    return this.getAlertTitle();
  }

  async submitAndReadInlineErrors(
    email: string,
    password: string,
  ): Promise<{ email: boolean; password: boolean }> {
    await this.login(email, password);
    return {
      email: await this.hasEmailError(),
      password: await this.hasPasswordError(),
    };
  }

  async focusEmailInput(): Promise<void> {
    await step('Focus the email input', () => this.tap(this.inputEmail));
  }

  async setEmail(value: string): Promise<void> {
    await step(`Set email to ${JSON.stringify(value)}`, async () => {
      await this.waitForVisible(this.inputEmail);
      await this.inputEmail.clearValue();
      if (value) {
        await this.inputEmail.setValue(value);
      }
    });
  }

  async setPassword(value: string): Promise<void> {
    await step(`Set password (length=${value.length})`, async () => {
      await this.waitForVisible(this.inputPassword);
      await this.inputPassword.clearValue();
      if (value) {
        await this.inputPassword.setValue(value);
      }
    });
  }

  async isLoginButtonEnabled(): Promise<boolean> {
    await this.waitForVisible(this.buttonLogin);
    return this.buttonLogin.isEnabled();
  }

  async tapAboveInputs(): Promise<void> {
    await step('Tap on a neutral area above the inputs', async () => {
      await this.waitForVisible(this.inputEmail);
      const rect = await this.inputEmail.getElementRect(await this.inputEmail.elementId);
      const x = rect.x + Math.round(rect.width / 2);
      const y = Math.max(rect.y - 100, 1);
      await tapAt(x, y);
    });
  }

  async waitForKeyboardShown(timeout = 5_000): Promise<void> {
    await browser.waitUntil(async () => browser.isKeyboardShown(), {
      timeout,
      interval: 200,
      timeoutMsg: 'Keyboard did not appear in time',
    });
  }

  async waitForKeyboardHidden(timeout = 5_000): Promise<void> {
    await browser.waitUntil(async () => !(await browser.isKeyboardShown()), {
      timeout,
      interval: 200,
      timeoutMsg: 'Keyboard did not hide in time',
    });
  }
}

export default new LoginPage();
