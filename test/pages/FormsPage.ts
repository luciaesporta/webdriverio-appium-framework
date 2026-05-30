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

  private get spinner() {
    return $(
      'android=new UiScrollable(new UiSelector().scrollable(true))' +
        '.scrollIntoView(new UiSelector().className("android.widget.Spinner"))',
    );
  }

  async selectDropdownOption(option: string): Promise<void> {
    await step(`Select dropdown option "${option}"`, async () => {
      const spin = this.$el(this.spinner);
      await spin.waitForDisplayed({ timeout: 10000 });
      await spin.click();
      const optionEl = await $(
        `android=new UiSelector().className("android.widget.CheckedTextView").text("${option}")`,
      );
      await optionEl.waitForExist({ timeout: 5000 });
      await optionEl.click();
    });
  }

  async getDropdownText(): Promise<string> {
    const spin = this.$el(this.spinner);
    await spin.waitForDisplayed();
    return spin.getText();
  }
}

export default new FormsPage();
