import type { ChainablePromiseElement } from 'webdriverio';

export type Selector = string | ChainablePromiseElement;

export abstract class BasePage {
  protected readonly defaultTimeout = 15_000;

  protected $el(selector: Selector): ChainablePromiseElement {
    return typeof selector === 'string' ? $(selector) : selector;
  }

  protected async waitForVisible(selector: Selector, timeout = this.defaultTimeout): Promise<void> {
    await this.$el(selector).waitForDisplayed({ timeout });
  }

  protected async tap(selector: Selector, timeout = this.defaultTimeout): Promise<void> {
    const el = this.$el(selector);
    await el.waitForDisplayed({ timeout });
    await el.click();
  }

  protected async typeInto(
    selector: Selector,
    value: string,
    timeout = this.defaultTimeout,
  ): Promise<void> {
    const el = this.$el(selector);
    await el.waitForDisplayed({ timeout });
    await el.setValue(value);
  }

  protected async getText(selector: Selector, timeout = this.defaultTimeout): Promise<string> {
    const el = this.$el(selector);
    await el.waitForDisplayed({ timeout });
    return el.getText();
  }

  protected async isVisible(selector: Selector): Promise<boolean> {
    return this.$el(selector).isDisplayed();
  }
}
