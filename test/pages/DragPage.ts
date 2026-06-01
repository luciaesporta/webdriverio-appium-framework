import type { ChainablePromiseElement } from 'webdriverio';
import { BaseScreen } from './BaseScreen';
import { step } from '../utils/allure';

type Cell = 'l1' | 'l2' | 'l3' | 'c1' | 'c2' | 'c3' | 'r1' | 'r2' | 'r3';

const PIECES: Cell[] = ['l1', 'l2', 'l3', 'c1', 'c2', 'c3', 'r1', 'r2', 'r3'];

const DRAG_PRESS_MS = 500;
const DRAG_MOVE_MS = 2000;

class DragPage extends BaseScreen {
  protected get screen() {
    return $('~Drag-drop-screen');
  }

  private dragPiece(cell: Cell) {
    return $(`~drag-${cell}`);
  }

  private dropTarget(cell: Cell) {
    return $(`~drop-${cell}`);
  }

  private async pointerDragBetween(
    source: ChainablePromiseElement,
    destination: ChainablePromiseElement,
  ): Promise<void> {
    const srcLoc = await source.getLocation();
    const srcSize = await source.getSize();
    const dstLoc = await destination.getLocation();
    const dstSize = await destination.getSize();

    const srcX = Math.round(srcLoc.x + srcSize.width / 2);
    const srcY = Math.round(srcLoc.y + srcSize.height / 2);
    const dstX = Math.round(dstLoc.x + dstSize.width / 2);
    const dstY = Math.round(dstLoc.y + dstSize.height / 2);

    await browser
      .action('pointer', { parameters: { pointerType: 'touch' } })
      .move({ x: srcX, y: srcY })
      .down({ button: 0 })
      .pause(DRAG_PRESS_MS)
      .move({ x: dstX, y: dstY, duration: DRAG_MOVE_MS })
      .pause(200)
      .up({ button: 0 })
      .perform();
    await browser.releaseActions();
  }

  async dragPieceTo(piece: Cell, target: Cell, retries = 3): Promise<void> {
    await step(`Drag piece "${piece}" onto drop zone "${target}"`, async () => {
      const source = this.$el(this.dragPiece(piece));
      const destination = this.$el(this.dropTarget(target));
      await source.waitForDisplayed({ timeout: this.defaultTimeout });
      await destination.waitForDisplayed({ timeout: this.defaultTimeout });

      for (let attempt = 0; attempt < retries; attempt++) {
        await this.pointerDragBetween(source, destination);
        const consumed = await browser
          .waitUntil(async () => !(await this.isPieceVisible(piece)), { timeout: 2000 })
          .catch(() => false);
        if (consumed) return;
      }
    });
  }

  private async isPieceVisible(cell: Cell): Promise<boolean> {
    const el = this.dragPiece(cell);
    if (!(await el.isExisting())) return false;
    return el.isDisplayed();
  }

  /** Dropped pieces stay in the tree with opacity 0; count only visible pieces. */
  async countRemainingPieces(): Promise<number> {
    let count = 0;
    for (const cell of PIECES) {
      if (await this.isPieceVisible(cell)) count++;
    }
    return count;
  }

  async isPieceConsumed(cell: Cell): Promise<boolean> {
    return !(await this.isPieceVisible(cell));
  }

  async waitForPieceConsumed(cell: Cell, timeout = 10_000): Promise<void> {
    await browser.waitUntil(async () => this.isPieceConsumed(cell), {
      timeout,
      timeoutMsg: `Piece "${cell}" was not consumed after drag`,
    });
  }

  async waitForPieceCountBelow(count: number, timeout = 10_000): Promise<void> {
    await browser.waitUntil(async () => (await this.countRemainingPieces()) < count, {
      timeout,
      timeoutMsg: `Expected fewer than ${count} visible drag pieces after drop`,
    });
  }
}

export default new DragPage();
