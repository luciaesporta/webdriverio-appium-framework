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

  it('@regression toggles the switch label between on and off', async () => {
    const before = (await FormsPage.getSwitchText()).toLowerCase();
    await FormsPage.toggleSwitch();
    const after = (await FormsPage.getSwitchText()).toLowerCase();
    expect(after).not.toBe(before);
  });
});
