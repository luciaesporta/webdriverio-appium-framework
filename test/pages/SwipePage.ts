import { BaseScreen } from './BaseScreen';
import { step } from '../utils/allure';

class SwipePage extends BaseScreen {
  protected get screen() {
    return $('~Swipe-screen');
  }

  private get card() {
    return $('~card');
  }

  async swipeCardLeft(): Promise<void> {
    await step('Swipe carousel card to the left', async () => {
      const el = this.card;
      await el.waitForDisplayed({ timeout: this.defaultTimeout });
      const { x, y, width, height } = await el.getElementRect(await el.elementId);
      const startX = x + Math.round(width * 0.85);
      const endX = x + Math.round(width * 0.15);
      const midY = y + Math.round(height / 2);
      await browser
        .action('pointer', { parameters: { pointerType: 'touch' } })
        .move({ x: startX, y: midY })
        .down()
        .pause(150)
        .move({ duration: 400, x: endX, y: midY })
        .up()
        .perform();
    });
  }

  async isCardDisplayed(): Promise<boolean> {
    return this.isVisible(this.card);
  }
}

export default new SwipePage();
