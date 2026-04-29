import { BaseScreen } from './BaseScreen';
import { step } from '../utils/allure';

const NATIVE_CONTEXT = 'NATIVE_APP';

type ContextHandle = string | { id: string };

class WebviewPage extends BaseScreen {
  protected get screen() {
    return $('~Webview-screen');
  }

  async waitForLoaded(): Promise<void> {
    await this.waitForWebviewContext();
  }


  async getCurrentContext(): Promise<string> {
    const ctx = (await browser.getContext()) as ContextHandle | null | undefined;
    if (!ctx) return '';
    return typeof ctx === 'string' ? ctx : ctx.id;
  }

  async getContexts(): Promise<string[]> {
    const contexts = (await browser.getContexts()) as ContextHandle[];
    return contexts.map((c) => (typeof c === 'string' ? c : c.id));
  }

  private async findWebviewContext(): Promise<string | undefined> {
    const contexts = await this.getContexts();
    return contexts.find((c) => c.startsWith('WEBVIEW'));
  }

  async waitForWebviewContext(timeout = 15_000): Promise<string> {
    let webviewCtx: string | undefined;
    await browser.waitUntil(
      async () => {
        webviewCtx = await this.findWebviewContext();
        return Boolean(webviewCtx);
      },
      { timeout, interval: 500, timeoutMsg: 'No WEBVIEW context appeared in time' },
    );
    return webviewCtx as string;
  }

  async switchToWebview(): Promise<string> {
    return step('Switch to WEBVIEW context', async () => {
      const target = await this.waitForWebviewContext();
      await browser.switchContext(target);
      return target;
    });
  }

  async switchToNative(): Promise<void> {
    await step(`Switch back to ${NATIVE_CONTEXT} context`, async () => {
      await browser.switchContext(NATIVE_CONTEXT);
    });
  }
}

export default new WebviewPage();
