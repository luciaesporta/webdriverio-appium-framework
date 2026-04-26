import 'dotenv/config';
import path from 'path';
import { saveFailureScreenshot } from '../test/utils/screenshot';

export const ROOT_DIR = path.resolve(__dirname, '..');

export const sharedConfig: Partial<WebdriverIO.Config> = {
  runner: 'local',
  port: 4723,

  specs: ['../test/specs/**/*.ts'],
  exclude: [],

  maxInstances: 1,

  logLevel: (process.env.WDIO_LOG_LEVEL as WebdriverIO.Config['logLevel']) ?? 'info',
  bail: 0,
  waitforTimeout: 10_000,
  connectionRetryTimeout: 120_000,
  connectionRetryCount: 3,

  services: [
    [
      'appium',
      {
        command: 'appium',
        args: {
          relaxedSecurity: true,
          log: path.join(ROOT_DIR, 'appium.log'),
          logLevel: process.env.APPIUM_LOG_LEVEL ?? 'info',
        },
      },
    ],
  ],

  framework: 'mocha',
  reporters: ['spec'],

  mochaOpts: {
    ui: 'bdd',
    timeout: 60_000,
  },

  afterTest: async function (test, _context, result) {
    if (!result.passed) {
      try {
        const filePath = await saveFailureScreenshot(test.title, test.parent);
        console.info(`[screenshot] saved failure screenshot to ${filePath}`);
      } catch (err) {
        console.error('[screenshot] failed to capture failure screenshot', err);
      }
    }
  },
};
