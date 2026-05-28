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

  it('@regression F-02 long text (>50 chars) reflects completely in result label', async () => {
    const longText = 'A'.repeat(51);
    await FormsPage.typeText(longText);
    expect(await FormsPage.getEchoedText()).toBe(longText);
  });

  it('@regression F-01 clearing input leaves result label empty', async () => {
    await FormsPage.typeText('temporary text');
    expect(await FormsPage.getEchoedText()).toBe('temporary text');

    await FormsPage.clearInput();
    const result = await FormsPage.getEchoedText();
    expect(result === '' || result === 'You typed:').toBeTruthy();
  });

  it('@regression toggles the switch label between on and off', async () => {
    const before = (await FormsPage.getSwitchText()).toLowerCase();
    await FormsPage.toggleSwitch();
    const after = (await FormsPage.getSwitchText()).toLowerCase();
    expect(after).not.toBe(before);
  });
});
