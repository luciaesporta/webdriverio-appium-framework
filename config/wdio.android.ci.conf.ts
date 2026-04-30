import path from 'path';
import { ROOT_DIR, sharedConfig } from './wdio.shared';

const APK_FILE = process.env.APK_FILE ?? 'android.wdio.native.app.v2.2.0.apk';
const APK_PATH = process.env.APK_PATH
  ? path.resolve(process.env.APK_PATH)
  : path.join(ROOT_DIR, 'apps', APK_FILE);

const capability: WebdriverIO.Capabilities = {
  platformName: 'Android',
  'appium:deviceName': 'emulator-5554',
  'appium:automationName': 'UiAutomator2',
  'appium:app': APK_PATH,
  'appium:newCommandTimeout': 240,
  'appium:autoGrantPermissions': true,
};

export const config: WebdriverIO.Config = {
  ...sharedConfig,
  capabilities: [capability],
};
