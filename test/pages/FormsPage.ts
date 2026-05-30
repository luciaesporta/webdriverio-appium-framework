import { BaseScreen } from './BaseScreen';
import { step } from '../utils/allure';

class FormsPage extends BaseScreen {
  protected get screen() {
    return $('~Forms-screen');
  }

  private get textInput() {
    return $('~text-input');
  }

  private get textInputResult() {
    return $('~input-text-result');
  }

  private get switch() {
    return $('~switch');
  }

  private get switchText() {
    return $('~switch-text');
  }

  private get dropdown() {
    return $('~Dropdown');
  }

  async typeText(text: string): Promise<void> {
    await step(`Type ${JSON.stringify(text)} into the text input`, () =>
      this.typeInto(this.textInput, text),
    );
  }

  async clearInput(): Promise<void> {
    await step('Clear the text input', async () => {
      const el = this.$el(this.textInput);
      await el.waitForDisplayed();
      await el.clearValue();
    });
  }

  async getEchoedText(): Promise<string> {
    return this.getText(this.textInputResult);
  }

  async toggleSwitch(): Promise<void> {
    await step('Toggle the switch', () => this.tap(this.switch));
  }

  async getSwitchText(): Promise<string> {
    return this.getText(this.switchText);
  }

  async selectDropdownOption(option: string): Promise<void> {
    await step(`Select dropdown option "${option}"`, async () => {
      const el = this.$el(this.dropdown);
      await el.scrollIntoView();
      await el.click();
      const optionEl = await $(`android=new UiSelector().text("${option}")`);
      await optionEl.waitForDisplayed({ timeout: 5000 });
      await optionEl.click();
    });
  }

  private get activeButton() {
    return $('~button-Active');
  }

  private get inactiveButton() {
    return $('~button-Inactive');
  }

  async tapActiveButton(): Promise<void> {
    await step('Tap the Active button', async () => {
      const el = this.$el(this.activeButton);
      await el.scrollIntoView();
      await el.click();
    });
  }

  async tapInactiveButton(): Promise<void> {
    await step('Tap the Inactive button', async () => {
      const el = this.$el(this.inactiveButton);
      await el.scrollIntoView();
      await el.click();
    });
  }

  async isActiveButtonEnabled(): Promise<boolean> {
    const el = this.$el(this.activeButton);
    await el.waitForDisplayed();
    return el.isEnabled();
  }

  async isInactiveButtonEnabled(): Promise<boolean> {
    const el = this.$el(this.inactiveButton);
    await el.waitForDisplayed();
    return el.isEnabled();
  }

  async getDropdownText(): Promise<string> {
    const dropdown = this.$el(this.dropdown);
    await dropdown.waitForDisplayed();

    const input = dropdown.$('android.widget.EditText');
    if (await input.isExisting()) {
      const value = (await input.getText()).trim();
      if (value) return value;
    }

    const textViews = await dropdown.$$('android.widget.TextView');
    for (const view of textViews) {
      const text = (await view.getText()).trim();
      if (/[a-zA-Z]/.test(text)) return text;
    }

    return (await dropdown.getText()).trim();
  }
}

export default new FormsPage();
