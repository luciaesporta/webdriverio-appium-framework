import SwipePage from '@pages/SwipePage';
import NavBar from '@pages/NavBar';

describe('Swipe screen', () => {
  beforeEach(async () => {
    await NavBar.goTo('Swipe');
    await SwipePage.waitForLoaded();
  });

  it('@regression keeps the carousel card visible after a left swipe', async () => {
    expect(await SwipePage.isCardDisplayed()).toBe(true);
    await SwipePage.swipeCardLeft();
    expect(await SwipePage.isCardDisplayed()).toBe(true);
  });
});
