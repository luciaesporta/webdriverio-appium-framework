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

  private get dropdown() {
    return $('~Dropdown');
  }

  async selectDropdownOption(option: string): Promise<void> {
    await step(`Select dropdown option "${option}"`, async () => {
      await this.tap(this.dropdown);
      const optionEl = await $(`android=new UiSelector().text("${option}")`);
      await optionEl.click();
    });
  }

  async getDropdownText(): Promise<string> {
    return this.getText(this.dropdown);
  }
}

export default new FormsPage();
