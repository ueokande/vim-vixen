import * as windows from "../ambassador/src/client/windows";
import * as tabs from "../ambassador/src/client/tabs";
import * as keys from "../ambassador/src/client/keys";
import * as scrolls from "../ambassador/src/client/scrolls";
import { CLIENT_URL } from '../web-server/url';

describe("scroll test", () => {
  let targetWindow;
  let targetTab;

  before(async () => {
    targetWindow = await windows.create();
    targetTab = await tabs.create(targetWindow.id, CLIENT_URL + '/scroll');
  });

  after(async () => {
    await windows.remove(targetWindow.id);
  });

  it('scrolls up by k', async () => {
    let before = await scrolls.set(targetTab.id, 100, 100);
    await keys.press(targetTab.id, 'k');

    let actual = await scrolls.get(targetTab.id);
    expect(actual.y).to.be.lessThan(before.y);
  });

  it('scrolls down by j', async () => {
    let before = await scrolls.set(targetTab.id, 100, 100);
    await keys.press(targetTab.id, 'j');

    let actual = await scrolls.get(targetTab.id);
    expect(actual.y).to.be.greaterThan(before.y);
  });

  it('scrolls left by h', async () => {
    let before = await scrolls.set(targetTab.id, 100, 100)
    await keys.press(targetTab.id, 'h');

    let actual = await scrolls.get(targetTab.id);
    expect(actual.x).to.be.lessThan(before.x);
  });

  it('scrolls top by gg', async () => {
    await scrolls.set(targetTab.id, 100, 100);
    await keys.press(targetTab.id, 'g');
    await keys.press(targetTab.id, 'g');
    let actual = await scrolls.get(targetTab.id);
    expect(actual.y).to.be.equals(0);
  });

  it('scrolls bottom by G', async () => {
    await scrolls.set(targetTab.id, 100, 100);
    await keys.press(targetTab.id, 'G', { shiftKey: true });

    let actual = await scrolls.get(targetTab.id);
    expect(actual.y).to.be.equals(actual.yMax);
  });

  it('scrolls bottom by 0', async () => {
    await scrolls.set(targetTab.id, 100, 100);
    await keys.press(targetTab.id, '0');

    let actual = await scrolls.get(targetTab.id);
    expect(actual.x).to.be.equals(0);
  });

  it('scrolls bottom by $', async () => {
    await scrolls.set(targetTab.id, 100, 100);
    await keys.press(targetTab.id, '$');

    let actual = await scrolls.get(targetTab.id);
    expect(actual.x).to.be.equals(actual.xMax);
  });

  it('scrolls bottom by <C-U>', async () => {
    let before = await scrolls.set(targetTab.id, 5000, 5000);
    await keys.press(targetTab.id, 'u', { ctrlKey: true });

    let actual = await scrolls.get(targetTab.id);
    expect(actual.y).to.closeTo(before.y - before.frameHeight / 2, 1);
  });

  it('scrolls bottom by <C-D>', async () => {
    let before = await scrolls.set(targetTab.id, 5000, 5000);
    await keys.press(targetTab.id, 'd', { ctrlKey: true });

    let actual = await scrolls.get(targetTab.id);
    expect(actual.y).to.closeTo(before.y + before.frameHeight / 2, 1);
  });

  it('scrolls bottom by <C-B>', async () => {
    let before = await scrolls.set(targetTab.id, 5000, 5000);
    await keys.press(targetTab.id, 'b', { ctrlKey: true });

    let actual = await await scrolls.get(targetTab.id);
    expect(actual.y).to.equals(before.y - before.frameHeight);
  });

  it('scrolls bottom by <C-F>', async () => {
    let before = await scrolls.set(targetTab.id, 5000, 5000);
    await keys.press(targetTab.id, 'f', { ctrlKey: true });
    let actual = await scrolls.get(targetTab.id);
    expect(actual.y).to.equals(before.y + before.frameHeight);
  });
});
