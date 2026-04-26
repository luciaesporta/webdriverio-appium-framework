import { BasePage } from './BasePage';
import { step } from '../utils/allure';

class HomePage extends BasePage {
  private get tabHome() {
    return $('~Home');
  }

  private get tabLogin() {
    return $('~Login');
  }

  async waitForHomeTab(): Promise<void> {
    await this.waitForVisible(this.tabHome);
  }

  async isHomeTabDisplayed(): Promise<boolean> {
    return this.isVisible(this.tabHome);
  }

  async navigateToLogin(): Promise<void> {
    await step('Navigate to Login tab', () => this.tap(this.tabLogin));
  }
}

export default new HomePage();
