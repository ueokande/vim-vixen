import * as windows from "../ambassador/src/client/windows";
import * as tabs from "../ambassador/src/client/tabs";
import * as keys from "../ambassador/src/client/keys";
import * as scrolls from "../ambassador/src/client/scrolls";
import { CLIENT_URL } from '../web-server/url';

describe("mark test", () => {
  let targetWindow;

  before(async () => {
    targetWindow = await windows.create();
  });

  after(async () => {
    await windows.remove(targetWindow.id);
  });

  it('set a local mark and jump to it', async () => {
    let tab = await tabs.create(targetWindow.id, CLIENT_URL + '/mark#local');
    await scrolls.set(tab.id, 100, 100);
    await keys.press(tab.id, 'm');
    await keys.press(tab.id, 'a');

    await scrolls.set(tab.id, 200, 200);
    await keys.press(tab.id, "'");
    await keys.press(tab.id, 'a');

    let scroll = await scrolls.get(tab.id);
    expect(scroll.x).to.be.equals(100);
    expect(scroll.y).to.be.equals(100);
  });

  it('set a global mark and jump to it', async () => {
    let tab1 = await tabs.create(targetWindow.id, CLIENT_URL + '/mark#global1');
    await scrolls.set(tab1.id, 100, 100);
    await keys.press(tab1.id, 'm');
    await keys.press(tab1.id, 'A');
    await new Promise(resolve => { setTimeout(() => resolve(), 100) });
    await scrolls.set(tab1.id, 200, 200);

    let tab2 = await tabs.create(targetWindow.id, CLIENT_URL + '/mark#global2');
    await keys.press(tab2.id, "'");
    await keys.press(tab2.id, 'A');
    await new Promise(resolve => { setTimeout(() => resolve(), 100) });

    tab1 = await tabs.get(tab1.id);
    expect(tab1.active).to.be.true;
    let scroll = await scrolls.get(tab1.id);
    expect(scroll.x).to.be.equals(100);
    expect(scroll.y).to.be.equals(100);
  });

  it('set a global mark and creates new tab from gone', async () => {
    let tab1 = await tabs.create(targetWindow.id, CLIENT_URL + '/mark#gone');
    await scrolls.set(tab1.id, 100, 100);
    await keys.press(tab1.id, 'm');
    await keys.press(tab1.id, 'A');
    await tabs.remove(tab1.id);
    await new Promise(resolve => { setTimeout(() => resolve(), 100) });

    let tab2 = await tabs.create(targetWindow.id, CLIENT_URL + '/mark#newtab');
    await keys.press(tab2.id, "'");
    await keys.press(tab2.id, 'A');
    await new Promise(resolve => { setTimeout(() => resolve(), 100) });

    let win = await windows.get(targetWindow.id);
    let found = win.tabs.find(tab => tab.url === CLIENT_URL + '/mark#gone')
    expect(found).to.be.an('object');
    expect(found.id).to.not.equal(tab1.id);
  });
});
