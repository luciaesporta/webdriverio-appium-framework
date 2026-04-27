import WebviewPage from '@pages/WebviewPage';
import NavBar from '@pages/NavBar';

describe('Webview screen', () => {
  beforeEach(async () => {
    await NavBar.goTo('Webview');
    await WebviewPage.waitForLoaded();
  });

  afterEach(async () => {
    if ((await WebviewPage.getCurrentContext()) !== 'NATIVE_APP') {
      await WebviewPage.switchToNative();
    }
  });

  it('@regression switches between NATIVE_APP and WEBVIEW contexts', async () => {
    expect(await WebviewPage.getCurrentContext()).toBe('NATIVE_APP');

    await WebviewPage.switchToWebview();
    expect(await WebviewPage.getCurrentContext()).toMatch(/^WEBVIEW/);

    await WebviewPage.switchToNative();
    expect(await WebviewPage.getCurrentContext()).toBe('NATIVE_APP');
  });
});
