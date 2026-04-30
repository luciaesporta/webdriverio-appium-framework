import { BaseScreen } from './BaseScreen';
import { step } from '../utils/allure';
import { swipeLeft } from '../utils/gestures';

class SwipePage extends BaseScreen {
  protected get screen() {
    return $('~Swipe-screen');
  }

  private get card() {
    return $('~card');
  }

  async swipeCardLeft(): Promise<void> {
    await step('Swipe carousel card to the left', () => swipeLeft(this.card));
  }

  async isCardDisplayed(): Promise<boolean> {
    return this.isVisible(this.card);
  }
}

export default new SwipePage();
