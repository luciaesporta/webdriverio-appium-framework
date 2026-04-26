import DragPage from '@pages/DragPage';
import NavBar from '@pages/NavBar';

describe('Drag and drop screen', () => {
  beforeEach(async () => {
    await NavBar.goTo('Drag');
    await DragPage.waitForLoaded();
  });

  it('@regression consumes a piece after dropping it on its target zone', async () => {
    const initialCount = await DragPage.countRemainingPieces();
    expect(initialCount).toBeGreaterThan(0);

    await DragPage.dragPieceTo('l1', 'l1');

    expect(await DragPage.countRemainingPieces()).toBeLessThan(initialCount);
  });
});
