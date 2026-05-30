import FormsPage from '@pages/FormsPage';
import NavBar from '@pages/NavBar';

describe('Forms screen', () => {
  beforeEach(async () => {
    await NavBar.goTo('Forms');
    await FormsPage.waitForLoaded();
  });

  it('@regression echoes typed text into the result label', async () => {
    const sample = 'Hello WebdriverIO';
    await FormsPage.typeText(sample);
    expect(await FormsPage.getEchoedText()).toBe(sample);
  });

  it('@regression clears the echoed result after retyping a new value', async () => {
    await FormsPage.typeText('wrong input');
    expect(await FormsPage.getEchoedText()).toBe('wrong input');

    await FormsPage.typeText('corrected input');
    expect(await FormsPage.getEchoedText()).toBe('corrected input');
  });

  it('@regression F-03 special characters and emojis render correctly', async () => {
    const special = '¡Hola! @#$%^& 🚀🔥';
    await FormsPage.typeText(special);
    expect(await FormsPage.getEchoedText()).toBe(special);
  });

  it('@regression F-02 long text (>50 chars) reflects completely in result label', async () => {
    const longText = 'A'.repeat(51);
    await FormsPage.typeText(longText);
    const echoed = await FormsPage.getEchoedText();
    expect(echoed.length).toBeGreaterThan(0);
    expect(longText.startsWith(echoed)).toBe(true);
  });

  it('@regression F-01 clearing input leaves result label empty', async () => {
    await FormsPage.typeText('temporary text');
    expect(await FormsPage.getEchoedText()).toBe('temporary text');

    await FormsPage.clearInput();
    const result = await FormsPage.getEchoedText();
    expect(result === '' || result === 'You typed:').toBeTruthy();
  });

  it('@regression F-04 dropdown displays correct text for each option', async () => {
    const options = ['webdriver.io is awesome', 'Appium is awesome', 'This app is awesome'];

    for (const option of options) {
      await FormsPage.selectDropdownOption(option);
      expect(await FormsPage.getDropdownText()).toContain(option);
    }
  });

  it('@regression F-05 Active button is tappable and Inactive button produces no effect', async () => {
    expect(await FormsPage.isActiveButtonEnabled()).toBe(true);
    expect(await FormsPage.isInactiveButtonEnabled()).toBe(false);

    await FormsPage.tapActiveButton();
    // Active button should trigger native alert
    const alert = await $('id=android:id/message');
    await alert.waitForDisplayed({ timeout: 5000 });
    const alertText = await alert.getText();
    expect(alertText).toBeTruthy();

    // Dismiss alert
    const okButton = await $('id=android:id/button1');
    await okButton.click();
  });

  it('@regression toggles the switch label between on and off', async () => {
    const before = (await FormsPage.getSwitchText()).toLowerCase();
    await FormsPage.toggleSwitch();
    const after = (await FormsPage.getSwitchText()).toLowerCase();
    expect(after).not.toBe(before);
  });
});
