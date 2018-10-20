import * as windows from "../ambassador/src/client/windows";
import * as tabs from "../ambassador/src/client/tabs";
import * as keys from "../ambassador/src/client/keys";
import { CLIENT_URL } from '../web-server/url';

describe("zoom test", () => {
  let targetWindow;
  let targetTab;

  before(async () => {
    targetWindow = await windows.create(CLIENT_URL);
  });

  after(async () => {
    await windows.remove(targetWindow.id);
  });

  beforeEach(async () => {
    targetTab = await tabs.create(targetWindow.id, CLIENT_URL);
  });

  it('zooms-in by zi', async () => {
    let before = await tabs.getZoom(targetTab.id);
    await keys.press(targetTab.id, 'z');
    await keys.press(targetTab.id, 'i');
    await new Promise(resolve => setTimeout(resolve, 100));

    let actual = await tabs.getZoom(targetTab.id);
    expect(actual).to.be.greaterThan(before);
  });

  it('zooms-in by zo', async () => {
    let before = await tabs.getZoom(targetTab.id);
    await keys.press(targetTab.id, 'z');
    await keys.press(targetTab.id, 'o');
    await new Promise(resolve => setTimeout(resolve, 100));

    let actual = await tabs.getZoom(targetTab.id);
    expect(actual).to.be.lessThan(before);
  });

  it('zooms-in by zz', async () => {
    await tabs.setZoom(targetTab.id, 1.5);
    let before = await tabs.getZoom(targetTab.id);
    await keys.press(targetTab.id, 'z');
    await keys.press(targetTab.id, 'z');
    await new Promise(resolve => setTimeout(resolve, 100));

    let actual = await tabs.getZoom(targetTab.id);
    expect(actual).to.be.lessThan(before);
    expect(actual).to.equal(1);
  });
});
