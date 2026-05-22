import type { ChainablePromiseElement } from 'webdriverio';

const PRESS_DURATION_MS = 150;
const MOVE_DURATION_MS = 400;

interface Point {
  x: number;
  y: number;
}

async function elementRect(el: ChainablePromiseElement) {
  await el.waitForDisplayed();
  return el.getElementRect(await el.elementId);
}

async function performSwipe(start: Point, end: Point): Promise<void> {
  await browser
    .action('pointer', { parameters: { pointerType: 'touch' } })
    .move({ x: start.x, y: start.y })
    .down()
    .pause(PRESS_DURATION_MS)
    .move({ duration: MOVE_DURATION_MS, x: end.x, y: end.y })
    .up()
    .perform();
}

export async function swipeLeft(el: ChainablePromiseElement): Promise<void> {
  const { x, y, width, height } = await elementRect(el);
  const startX = x + Math.round(width * 0.85);
  const endX = x + Math.round(width * 0.15);
  const midY = y + Math.round(height / 2);
  await performSwipe({ x: startX, y: midY }, { x: endX, y: midY });
}

export async function swipeRight(el: ChainablePromiseElement): Promise<void> {
  const { x, y, width, height } = await elementRect(el);
  const startX = x + Math.round(width * 0.15);
  const endX = x + Math.round(width * 0.85);
  const midY = y + Math.round(height / 2);
  await performSwipe({ x: startX, y: midY }, { x: endX, y: midY });
}

export async function swipeUp(el: ChainablePromiseElement): Promise<void> {
  const { x, y, width, height } = await elementRect(el);
  const midX = x + Math.round(width / 2);
  const startY = y + Math.round(height * 0.85);
  const endY = y + Math.round(height * 0.15);
  await performSwipe({ x: midX, y: startY }, { x: midX, y: endY });
}

export async function swipeDown(el: ChainablePromiseElement): Promise<void> {
  const { x, y, width, height } = await elementRect(el);
  const midX = x + Math.round(width / 2);
  const startY = y + Math.round(height * 0.15);
  const endY = y + Math.round(height * 0.85);
  await performSwipe({ x: midX, y: startY }, { x: midX, y: endY });
}

export async function longPress(el: ChainablePromiseElement, durationMs = 1000): Promise<void> {
  const { x, y, width, height } = await elementRect(el);
  const cx = x + Math.round(width / 2);
  const cy = y + Math.round(height / 2);
  await browser
    .action('pointer', { parameters: { pointerType: 'touch' } })
    .move({ x: cx, y: cy })
    .down()
    .pause(durationMs)
    .up()
    .perform();
}
