import { BasePage } from './BasePage';

class HomePage extends BasePage {
  private get homeScreen() {
    return $('~Home-screen');
  }

  async waitForLoaded(): Promise<void> {
    await this.waitForVisible(this.homeScreen);
  }

  async isLoaded(): Promise<boolean> {
    return this.isVisible(this.homeScreen);
  }
}

export default new HomePage();
