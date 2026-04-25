import path from 'path';

const APK_PATH = path.resolve(__dirname, 'apps', 'android.wdio.native.app.v2.2.0.apk');

export const config: WebdriverIO.Config = {
  runner: 'local',
  port: 4723,

  specs: ['./test/specs/**/*.ts'],
  exclude: [],

  maxInstances: 1,

  capabilities: [
    {
      platformName: 'Android',
      'appium:deviceName': 'Pixel_7',
      'appium:platformVersion': '16',
      'appium:automationName': 'UiAutomator2',
      'appium:app': APK_PATH,
      'appium:avd': 'Pixel_7',
      'appium:avdLaunchTimeout': 120000,
      'appium:newCommandTimeout': 240,
      'appium:autoGrantPermissions': true,
    },
  ],

  logLevel: 'info',
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  services: [
    [
      'appium',
      {
        command: 'appium',
        args: {
          relaxedSecurity: true,
          log: './appium.log',
        },
      },
    ],
  ],

  framework: 'mocha',
  reporters: ['spec'],

  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
};
