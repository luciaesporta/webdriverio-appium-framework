import { BasePage } from './BasePage';
import { step } from '../utils/allure';

type Tab = 'Home' | 'Webview' | 'Login' | 'Forms' | 'Swipe' | 'Drag';

class NavBar extends BasePage {
  private tabSelector(name: Tab) {
    return $(`~${name}`);
  }

  async goTo(tab: Tab): Promise<void> {
    await step(`Navigate to ${tab} tab`, () => this.tap(this.tabSelector(tab)));
  }
}

export default new NavBar();
