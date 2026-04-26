import path from 'path';
import { promises as fs } from 'fs';

const SCREENSHOTS_DIR = path.resolve(process.cwd(), 'screenshots');

function sanitize(input: string): string {
  return input.replace(/[^a-z0-9-_]+/gi, '_').toLowerCase();
}

export async function saveFailureScreenshot(testTitle: string, suiteTitle = ''): Promise<string> {
  await fs.mkdir(SCREENSHOTS_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `${sanitize(suiteTitle)}__${sanitize(testTitle)}__${stamp}.png`;
  const filePath = path.join(SCREENSHOTS_DIR, fileName);
  await browser.saveScreenshot(filePath);
  return filePath;
}
