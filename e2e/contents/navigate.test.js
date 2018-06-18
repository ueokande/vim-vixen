import * as windows from "../ambassador/src/client/windows";
import * as tabs from "../ambassador/src/client/tabs";
import * as keys from "../ambassador/src/client/keys";
import * as scrolls from "../ambassador/src/client/scrolls";
import { CLIENT_URL } from '../web-server/url';

describe("navigate test", () => {
  let targetWindow;

  before(async () => {
    targetWindow = await windows.create();
    await tabs.create(targetWindow.id, CLIENT_URL);
  });

  after(async () => {
    await windows.remove(targetWindow.id);
  });

  it('goes to parent', async () => {
    let tab = await tabs.create(targetWindow.id, CLIENT_URL + '/a/b/c');
    await keys.press(tab.id, 'g');
    await keys.press(tab.id, 'u');
    await new Promise(resolve => { setTimeout(() => resolve(), 10) });

    tab = await tabs.get(tab.id);
    expect(tab.url).to.be.equal(CLIENT_URL + '/a/b/');
  });

  it('removes hash', async () => {
    let tab = await tabs.create(targetWindow.id, CLIENT_URL + '/a/b/c#navigate');
    await keys.press(tab.id, 'g');
    await keys.press(tab.id, 'u');
    tab = await tabs.get(tab.id);
    expect(tab.url).to.be.equal(CLIENT_URL + '/a/b/c#');
  });

  it('goes to root', async () => {
    let tab = await tabs.create(targetWindow.id, CLIENT_URL + '/a/b/c');
    await keys.press(tab.id, 'g');
    await keys.press(tab.id, 'U', { shiftKey: true });
    await new Promise(resolve => { setTimeout(() => resolve(), 10) });

    tab = await tabs.get(tab.id);
    expect(tab.url).to.be.equal(CLIENT_URL + '/');
  });

  it('goes back and forward in history', async () => {
    let tab = await tabs.create(targetWindow.id, CLIENT_URL + '/#navigate');
    await keys.press(tab.id, 'g');
    await keys.press(tab.id, 'u');
    await keys.press(tab.id, 'H', { shiftKey: true });
    await new Promise(resolve => { setTimeout(() => resolve(), 10) });

    tab = await tabs.get(tab.id);
    expect(tab.url, 'go back in history').to.be.equal(CLIENT_URL + '/#navigate');
    await new Promise(resolve => { setTimeout(() => resolve(), 10) });
    await keys.press(tab.id, 'L', { shiftKey: true });

    tab = await tabs.get(tab.id);
    expect(tab.url, 'go next in history').to.be.equal(CLIENT_URL + '/#');
  });

  it('goes previous page by <a>', async () => {
    let tab = await tabs.create(targetWindow.id, CLIENT_URL + '/a-pagenation?page=10');
    await keys.press(tab.id, '[');
    await keys.press(tab.id, '[');
    await new Promise(resolve => { setTimeout(() => resolve(), 10) });

    tab = await tabs.get(tab.id);
    expect(tab.url).to.be.equal(CLIENT_URL + '/a-pagenation?page=9');
  })

  it('goes next page by <a>', async () => {
    let tab = await tabs.create(targetWindow.id, CLIENT_URL + '/a-pagenation?page=10');
    await keys.press(tab.id, ']');
    await keys.press(tab.id, ']');
    await new Promise(resolve => { setTimeout(() => resolve(), 10) });

    tab = await tabs.get(tab.id);
    expect(tab.url).to.be.equal(CLIENT_URL + '/a-pagenation?page=11');
  })

  it('goes previous page by <link>', async () => {
    let tab = await tabs.create(targetWindow.id, CLIENT_URL + '/link-pagenation?page=10');
    await keys.press(tab.id, '[');
    await keys.press(tab.id, '[');
    await new Promise(resolve => { setTimeout(() => resolve(), 10) });

    tab = await tabs.get(tab.id);
    expect(tab.url).to.be.equal(CLIENT_URL + '/link-pagenation?page=9');
  })

  it('goes next page by <link>', async () => {
    let tab = await tabs.create(targetWindow.id, CLIENT_URL + '/link-pagenation?page=10');
    await keys.press(tab.id, ']');
    await keys.press(tab.id, ']');
    await new Promise(resolve => { setTimeout(() => resolve(), 10) });

    tab = await tabs.get(tab.id);
    expect(tab.url).to.be.equal(CLIENT_URL + '/link-pagenation?page=11');
  })
});
