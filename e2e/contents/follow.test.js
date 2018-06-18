import * as windows from "../ambassador/src/client/windows";
import * as tabs from "../ambassador/src/client/tabs";
import * as keys from "../ambassador/src/client/keys";
import { CLIENT_URL } from '../web-server/url';

describe("tab test", () => {
  let targetWindow;

  beforeEach(async () => {
    targetWindow = await windows.create(CLIENT_URL);
  });

  afterEach(async () => {
    await windows.remove(targetWindow.id);
  });return

  it('follows link by `f`', async() => {
    let tab = await tabs.create(targetWindow.id, CLIENT_URL + '/follow');
    await keys.press(tab.id, 'f');
    await new Promise(resolve => { setTimeout(() => resolve(), 10) });
    await keys.press(tab.id, 'a');
    await new Promise(resolve => { setTimeout(() => resolve(), 10) });

    tab =  tabs.get(tab.id);
    expect(tab.url).to.be.equal(CLIENT_URL + '/follow#a');
  });

  it('follows link into new tab by `F`', async () => {
    let tab = await tabs.create(targetWindow.id, CLIENT_URL + '/follow');
    await keys.press(tab.id, 'F', { shiftKey: true });
    await new Promise(resolve => { setTimeout(() => resolve(), 10) });
    await keys.press(tab.id, 'a');
    await new Promise(resolve => { setTimeout(() => resolve(), 500) });

    let win = await windows.get(targetWindow.id);
    let urls = win.tabs.map(t => t.url);
    expect(urls).to.have.lengthOf(3);
    expect(urls).to.include(CLIENT_URL + '/');
    expect(urls).to.include(CLIENT_URL + '/follow');
    expect(urls).to.include(CLIENT_URL + '/follow#a');
  });

  it('follows link with target=_blank into new tab by `f`', async () => {
    let tab = await tabs.create(targetWindow.id, CLIENT_URL + '/follow');
    await keys.press(tab.id, 'f');
    await new Promise(resolve => { setTimeout(() => resolve(), 10) });
    await keys.press(tab.id, 'b');
    await new Promise(resolve => { setTimeout(() => resolve(), 500) });

    let win = await windows.get(targetWindow.id);
    let urls = win.tabs.map(t => t.url);
    expect(urls).to.have.lengthOf(3);
    expect(urls).to.include(CLIENT_URL + '/');
    expect(urls).to.include(CLIENT_URL + '/follow');
    expect(urls).to.include(CLIENT_URL + '/follow#external');
  });

  it('follows link with target=_blank into new tab by `F`', async () => {
    let tab = await tabs.create(targetWindow.id, CLIENT_URL + '/follow');
    await keys.press(tab.id, 'F', { shiftKey: true });
    await new Promise(resolve => { setTimeout(() => resolve(), 10) });
    await keys.press(tab.id, 'b');
    await new Promise(resolve => { setTimeout(() => resolve(), 500) });

    let win = await windows.get(targetWindow.id);
    let urls = win.tabs.map(t => t.url);
    expect(urls).to.have.lengthOf(3);
    expect(urls).to.include(CLIENT_URL + '/');
    expect(urls).to.include(CLIENT_URL + '/follow');
    expect(urls).to.include(CLIENT_URL + '/follow#external');
  });

  it('follows area by `F`', async () => {
    let tab = await tabs.create(targetWindow.id, CLIENT_URL + '/follow');
    await keys.press(tab.id, 'f');
    await new Promise(resolve => { setTimeout(() => resolve(), 10) });
    await keys.press(tab.id, 'c');
    await new Promise(resolve => { setTimeout(() => resolve(), 10) });

    tab = await tabs.get(tab.id);
    expect(tab.url).to.be.equal(CLIENT_URL + '/follow#area');
  });
});
