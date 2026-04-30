import path from 'path';
import { ROOT_DIR, sharedConfig } from './wdio.shared';

const APK_FILE = process.env.APK_FILE ?? 'android.wdio.native.app.v2.2.0.apk';
const APK_PATH = process.env.APK_PATH
  ? path.resolve(process.env.APK_PATH)
  : path.join(ROOT_DIR, 'apps', APK_FILE);

const ANDROID_AVD = process.env.ANDROID_AVD ?? 'Pixel_7';
const ANDROID_PLATFORM_VERSION = process.env.ANDROID_PLATFORM_VERSION ?? '16';

const capability: WebdriverIO.Capabilities = {
  platformName: 'Android',
  'appium:deviceName': process.env.ANDROID_DEVICE_NAME ?? ANDROID_AVD,
  'appium:platformVersion': ANDROID_PLATFORM_VERSION,
  'appium:automationName': 'UiAutomator2',
  'appium:app': APK_PATH,
  'appium:newCommandTimeout': 240,
  'appium:autoGrantPermissions': true,
  'appium:avd': ANDROID_AVD,
  'appium:avdLaunchTimeout': 120_000,
};

export const config: WebdriverIO.Config = {
  ...sharedConfig,
  capabilities: [capability],
};
