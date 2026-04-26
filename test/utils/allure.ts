import allure from '@wdio/allure-reporter';

export const step = allure.step;

export async function attachScreenshot(name: string, buffer: Buffer): Promise<void> {
  await allure.addAttachment(name, buffer, 'image/png');
}
