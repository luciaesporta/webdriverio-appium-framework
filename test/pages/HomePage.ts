import { BaseScreen } from './BaseScreen';

class HomePage extends BaseScreen {
  protected get screen() {
    return $('~Home-screen');
  }

  async isLoaded(): Promise<boolean> {
    return this.isVisible(this.screen);
  }
}

export default new HomePage();
