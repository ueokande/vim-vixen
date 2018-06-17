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
  });

  it('deletes tab by d', async () => {
    let tab = await tabs.create(targetWindow.id, CLIENT_URL);
    let before = await windows.get(targetWindow.id);
    await keys.press(tab.id, 'd');

    let actual = await windows.get(targetWindow.id);
    expect(actual.tabs).to.have.lengthOf(before.tabs.length - 1);
  });

  it('duplicates tab by zd', async () => {
    let tab = await tabs.create(targetWindow.id, CLIENT_URL);
    let before = await windows.get(targetWindow.id)
    await keys.press(tab.id, 'z');
    await keys.press(tab.id, 'd');

    let actual = await windows.get(targetWindow.id);
    expect(actual.tabs).to.have.lengthOf(before.tabs.length + 1);
  });

  it('makes pinned by zp', async () => {
    let tab = await tabs.create(targetWindow.id, CLIENT_URL);
    let before = await windows.get(targetWindow.id);
    await keys.press(tab.id, 'z');
    await keys.press(tab.id, 'p');

    let actual = await windows.get(targetWindow.id);
    expect(actual.tabs[0].pinned).to.be.true;
  });

  it('selects previous tab by K', async () => {
    await tabs.create(targetWindow.id, CLIENT_URL + '#1');
    await tabs.create(targetWindow.id, CLIENT_URL + '#2');
    await tabs.create(targetWindow.id, CLIENT_URL + '#3');
    let tab = await tabs.selectAt(targetWindow.id, 2);
    await keys.press(tab.id, 'K', { shiftKey: true });

    let win = await windows.get(targetWindow.id);
    expect(win.tabs[1].active).to.be.true;
  });

  it('selects previous tab by K rotatory', async () => {
    await tabs.create(targetWindow.id, CLIENT_URL + '#1');
    await tabs.create(targetWindow.id, CLIENT_URL + '#2');
    await tabs.create(targetWindow.id, CLIENT_URL + '#3');
    let tab = await tabs.selectAt(targetWindow.id, 0);
    await keys.press(tab.id, 'K', { shiftKey: true });

    let win = await windows.get(targetWindow.id);
    expect(win.tabs[3].active).to.be.true;
  });

  it('selects next tab by J', async () => {
    await tabs.create(targetWindow.id, CLIENT_URL + '#1');
    await tabs.create(targetWindow.id, CLIENT_URL + '#2');
    await tabs.create(targetWindow.id, CLIENT_URL + '#3');
    let tab = await tabs.selectAt(targetWindow.id, 2);
    await keys.press(tab.id, 'J', { shiftKey: true });

    let win = await windows.get(targetWindow.id);
    expect(win.tabs[3].active).to.be.true;
  });

  it('selects previous tab by J rotatory', async () => {
    await tabs.create(targetWindow.id, CLIENT_URL + '#1');
    await tabs.create(targetWindow.id, CLIENT_URL + '#2');
    await tabs.create(targetWindow.id, CLIENT_URL + '#3');
    let tab = await tabs.selectAt(targetWindow.id, 3);
    await keys.press(tab.id, 'J', { shiftKey: true });

    let win = await windows.get(targetWindow.id);
    expect(win.tabs[0].active).to.be.true;
  });

  it('selects first tab by g0', async () => {
    await tabs.create(targetWindow.id, CLIENT_URL + '#1');
    await tabs.create(targetWindow.id, CLIENT_URL + '#2');
    await tabs.create(targetWindow.id, CLIENT_URL + '#3');
    let tab = await tabs.selectAt(targetWindow.id, 2);
    await keys.press(tab.id, 'g');
    await keys.press(tab.id, '0');

    let win = await windows.get(targetWindow.id);
    expect(win.tabs[0].active).to.be.true;
  });

  it('selects last tab by g$', async () => {
    await tabs.create(targetWindow.id, CLIENT_URL + '#1');
    await tabs.create(targetWindow.id, CLIENT_URL + '#2');
    await tabs.create(targetWindow.id, CLIENT_URL + '#3');
    let tab = await tabs.selectAt(targetWindow.id, 2);
    await keys.press(tab.id, 'g');
    await keys.press(tab.id, '$');

    let win = await windows.get(targetWindow.id);
    expect(win.tabs[3].active).to.be.true;
  });

  it('selects last selected tab by <C-6>', async () => {
    await tabs.create(targetWindow.id, CLIENT_URL + '#1');
    await tabs.create(targetWindow.id, CLIENT_URL + '#2');
    await tabs.create(targetWindow.id, CLIENT_URL + '#3');
    await tabs.selectAt(targetWindow.id, 1);
    let tab = await tabs.selectAt(targetWindow.id, 3);
    await keys.press(tab.id, '6', { ctrlKey: true });

    let win = await windows.get(targetWindow.id);
    expect(win.tabs[1].active).to.be.true;
  });

  it('deletes tab by d', async () => {
    let tab = await tabs.create(targetWindow.id, CLIENT_URL + '#1');
    await keys.press(tab.id, 'd');

    let win = await windows.get(targetWindow.id);
    expect(win.tabs).to.have.lengthOf(1);
  });

  it('reopen tab by u', async () => {
    let tab = await tabs.create(targetWindow.id, CLIENT_URL + '#1');
    await keys.press(tab.id, 'd');

    let win = await windows.get(targetWindow.id);
    expect(win.tabs).to.have.lengthOf(1);

    await keys.press(win.tabs[0].id, 'u');
    await new Promise((resolve) => setTimeout(resolve, 100));

    win = await windows.get(targetWindow.id);
    expect(win.tabs).to.have.lengthOf(2);
  });

  it('does not delete pinned tab by d', async () => {
    let tab = await tabs.create(targetWindow.id, CLIENT_URL + '#1');
    tab = await tabs.update(tab.id, { pinned: true });
    await keys.press(tab.id, 'd');

    let win = await windows.get(targetWindow.id);
    expect(win.tabs).to.have.lengthOf(2);
  });

  it('deletes pinned tab by !d', async () => {
    let tab = await tabs.create(targetWindow.id, CLIENT_URL + '#1');
    tab = await tabs.update(tab.id, { pinned: true });
    await keys.press(tab.id, '!');
    await keys.press(tab.id, 'd');

    let win = await windows.get(targetWindow.id);
    expect(win.tabs).to.have.lengthOf(1);
  });

  it('opens view-source by gf', () => {
    let target;
    return Promise.resolve().then(() => {
      return windows.get(targetWindow.id);
    }).then((win) => {
      target = win.tabs[0];
      return keys.press(target.id, 'g');
    }).then(() => {
      return keys.press(target.id, 'f');
    }).then(() => {
      return new Promise((resolve) => setTimeout(resolve, 300));
    }).then(() => {
      return windows.get(targetWindow.id);
    }).then((win) => {
      expect(win.tabs.map((t) => t.url)).to.include.members([CLIENT_URL + '/', 'view-source:' + CLIENT_URL + '/']);
    });
  });
});
