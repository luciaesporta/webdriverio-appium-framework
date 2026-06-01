import type { ChainablePromiseElement } from 'webdriverio';
import { BaseScreen } from './BaseScreen';
import { step } from '../utils/allure';

type Cell = 'l1' | 'l2' | 'l3' | 'c1' | 'c2' | 'c3' | 'r1' | 'r2' | 'r3';

const PIECES: Cell[] = ['l1', 'l2', 'l3', 'c1', 'c2', 'c3', 'r1', 'r2', 'r3'];

const DRAG_PRESS_MS = 250;
const DRAG_MOVE_MS = 1500;

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
    const sourceSize = await source.getSize();
    const destSize = await destination.getSize();

    await browser
      .action('pointer', { parameters: { pointerType: 'touch' } })
      .move({
        origin: source,
        x: Math.round(sourceSize.width / 2),
        y: Math.round(sourceSize.height / 2),
      })
      .down({ button: 0 })
      .pause(DRAG_PRESS_MS)
      .move({
        origin: destination,
        x: Math.round(destSize.width / 2),
        y: Math.round(destSize.height / 2),
        duration: DRAG_MOVE_MS,
      })
      .pause(200)
      .up({ button: 0 })
      .perform();
    await browser.releaseActions();
  }

  async dragPieceTo(piece: Cell, target: Cell): Promise<void> {
    await step(`Drag piece "${piece}" onto drop zone "${target}"`, async () => {
      const source = this.$el(this.dragPiece(piece));
      const destination = this.$el(this.dropTarget(target));
      await source.waitForDisplayed({ timeout: this.defaultTimeout });
      await destination.waitForDisplayed({ timeout: this.defaultTimeout });
      await this.pointerDragBetween(source, destination);
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
