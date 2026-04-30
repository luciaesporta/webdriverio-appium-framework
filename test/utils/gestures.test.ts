import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ChainablePromiseElement } from 'webdriverio';
import { longPress, swipeDown, swipeLeft, swipeRight, swipeUp } from './gestures';

interface ActionChain {
  move: ReturnType<typeof vi.fn>;
  down: ReturnType<typeof vi.fn>;
  pause: ReturnType<typeof vi.fn>;
  up: ReturnType<typeof vi.fn>;
  perform: ReturnType<typeof vi.fn>;
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

let actionChain: ActionChain;
let mockBrowser: { action: ReturnType<typeof vi.fn> };

function makeMockElement(rect: Rect): ChainablePromiseElement {
  return {
    waitForDisplayed: vi.fn().mockResolvedValue(undefined),
    elementId: 'el-1',
    getElementRect: vi.fn().mockResolvedValue(rect),
  } as unknown as ChainablePromiseElement;
}

beforeEach(() => {
  actionChain = {
    move: vi.fn().mockReturnThis(),
    down: vi.fn().mockReturnThis(),
    pause: vi.fn().mockReturnThis(),
    up: vi.fn().mockReturnThis(),
    perform: vi.fn().mockResolvedValue(undefined),
  };
  mockBrowser = {
    action: vi.fn().mockReturnValue(actionChain),
  };
  vi.stubGlobal('browser', mockBrowser);
});

describe('swipeLeft', () => {
  it('moves from right edge to left edge along the vertical center', async () => {
    const el = makeMockElement({ x: 100, y: 200, width: 400, height: 600 });

    await swipeLeft(el);

    expect(mockBrowser.action).toHaveBeenCalledWith('pointer', {
      parameters: { pointerType: 'touch' },
    });
    expect(actionChain.move).toHaveBeenNthCalledWith(1, { x: 440, y: 500 });
    expect(actionChain.down).toHaveBeenCalledOnce();
    expect(actionChain.pause).toHaveBeenCalledWith(150);
    expect(actionChain.move).toHaveBeenNthCalledWith(2, { duration: 400, x: 160, y: 500 });
    expect(actionChain.up).toHaveBeenCalledOnce();
    expect(actionChain.perform).toHaveBeenCalledOnce();
  });
});

describe('swipeRight', () => {
  it('mirrors swipeLeft: moves from left edge to right edge', async () => {
    const el = makeMockElement({ x: 100, y: 200, width: 400, height: 600 });

    await swipeRight(el);

    expect(actionChain.move).toHaveBeenNthCalledWith(1, { x: 160, y: 500 });
    expect(actionChain.move).toHaveBeenNthCalledWith(2, { duration: 400, x: 440, y: 500 });
  });
});

describe('swipeUp', () => {
  it('moves from bottom edge to top edge along the horizontal center', async () => {
    const el = makeMockElement({ x: 100, y: 200, width: 400, height: 600 });

    await swipeUp(el);

    expect(actionChain.move).toHaveBeenNthCalledWith(1, { x: 300, y: 710 });
    expect(actionChain.move).toHaveBeenNthCalledWith(2, { duration: 400, x: 300, y: 290 });
  });
});

describe('swipeDown', () => {
  it('mirrors swipeUp: moves from top edge to bottom edge', async () => {
    const el = makeMockElement({ x: 100, y: 200, width: 400, height: 600 });

    await swipeDown(el);

    expect(actionChain.move).toHaveBeenNthCalledWith(1, { x: 300, y: 290 });
    expect(actionChain.move).toHaveBeenNthCalledWith(2, { duration: 400, x: 300, y: 710 });
  });
});

describe('longPress', () => {
  it('presses at the element center for the default duration of 1000 ms', async () => {
    const el = makeMockElement({ x: 100, y: 200, width: 400, height: 600 });

    await longPress(el);

    expect(actionChain.move).toHaveBeenCalledExactlyOnceWith({ x: 300, y: 500 });
    expect(actionChain.pause).toHaveBeenCalledWith(1000);
    expect(actionChain.up).toHaveBeenCalledOnce();
  });

  it('honours a custom press duration', async () => {
    const el = makeMockElement({ x: 0, y: 0, width: 200, height: 200 });

    await longPress(el, 2500);

    expect(actionChain.pause).toHaveBeenCalledWith(2500);
  });
});

describe('all swipes wait for the element before reading its rect', () => {
  it('calls waitForDisplayed prior to getElementRect', async () => {
    const el = makeMockElement({ x: 0, y: 0, width: 100, height: 100 });

    await swipeLeft(el);

    const waitOrder = (
      el.waitForDisplayed as unknown as { mock: { invocationCallOrder: number[] } }
    ).mock.invocationCallOrder[0];
    const rectOrder = (el.getElementRect as unknown as { mock: { invocationCallOrder: number[] } })
      .mock.invocationCallOrder[0];
    expect(waitOrder).toBeLessThan(rectOrder);
  });
});
