import type { ChainablePromiseElement } from 'webdriverio';
import { BasePage } from './BasePage';

export abstract class BaseScreen extends BasePage {
  protected abstract get screen(): ChainablePromiseElement;

  async waitForLoaded(): Promise<void> {
    await this.waitForVisible(this.screen);
  }
}
