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

  private get activeButtonAlertMessage() {
    return $('id=android:id/message');
  }

  private get activeButtonAlertOk() {
    return $('id=android:id/button1');
  }

  async waitForActiveButtonAlert(): Promise<string> {
    return step('Wait for Active button alert', () => this.getText(this.activeButtonAlertMessage));
  }

  async dismissActiveButtonAlert(): Promise<void> {
    await step('Dismiss Active button alert', async () => {
      await this.tap(this.activeButtonAlertOk);
      await this.activeButtonAlertMessage.waitForDisplayed({ reverse: true, timeout: 5000 });
    });
  }

  /** RN disabled TouchableOpacity still reports enabled on Android; verify by absence of alert. */
  async hasActiveButtonAlert(timeout = 2000): Promise<boolean> {
    return this.activeButtonAlertMessage
      .waitForDisplayed({ timeout })
      .then(() => true)
      .catch(() => false);
  }

  private get alertTitle() {
    return $('id=android:id/alertTitle');
  }

  private get alertMessage() {
    return $('id=android:id/message');
  }

  private get alertOkButton() {
    return $('id=android:id/button1');
  }

  async tapAlertButton(): Promise<void> {
    await step('Tap the alert button', async () => {
      const el = await $(
        'android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().description("button-Alert"))',
      );
      await el.waitForDisplayed({ timeout: 5000 });
      await el.click();
    });
  }

  async getAlertTitle(): Promise<string> {
    return step('Read alert title', () => this.getText(this.alertTitle));
  }

  async getAlertMessage(): Promise<string> {
    return step('Read alert message', () => this.getText(this.alertMessage));
  }

  async dismissAlert(): Promise<void> {
    await step('Dismiss alert with OK', async () => {
      await this.tap(this.alertOkButton);
      await this.alertTitle.waitForDisplayed({ reverse: true, timeout: 5000 });
    });
  }

  async isAlertVisible(): Promise<boolean> {
    return this.alertTitle.isDisplayed().catch(() => false);
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
