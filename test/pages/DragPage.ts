import { BaseScreen } from './BaseScreen';
import { step } from '../utils/allure';

type Cell = 'l1' | 'l2' | 'l3' | 'c1' | 'c2' | 'c3' | 'r1' | 'r2' | 'r3';

interface Point {
  x: number;
  y: number;
}

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

  private async centerOf(cell: Cell, kind: 'drag' | 'drop'): Promise<Point> {
    const el = kind === 'drag' ? this.dragPiece(cell) : this.dropTarget(cell);
    await el.waitForExist({ timeout: this.defaultTimeout });
    const rect = await el.getElementRect(await el.elementId);
    return {
      x: rect.x + Math.round(rect.width / 2),
      y: rect.y + Math.round(rect.height / 2),
    };
  }

  async dragPieceTo(piece: Cell, target: Cell): Promise<void> {
    await step(`Drag piece "${piece}" onto drop zone "${target}"`, async () => {
      const source = this.dragPiece(piece);
      await source.waitForDisplayed({ timeout: this.defaultTimeout });
      const end = await this.centerOf(target, 'drop');
      await browser.execute('mobile: dragGesture', {
        elementId: await source.elementId,
        endX: end.x,
        endY: end.y,
        speed: 1000,
      });
    });
  }

  async countRemainingPieces(): Promise<number> {
    const pieces = await $$('//android.view.ViewGroup[starts-with(@content-desc,"drag-")]');
    return pieces.length;
  }
}

export default new DragPage();
