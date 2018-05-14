import * as windows from "../ambassador/src/client/windows";
import * as tabs from "../ambassador/src/client/tabs";
import * as keys from "../ambassador/src/client/keys";
import { CLIENT_URL } from '../web-server/url';

describe("tab test", () => {
  let targetWindow;

  beforeEach(() => {
    return windows.create(CLIENT_URL).then((win) => {
      targetWindow = win;
    });
  });

  afterEach(() => {
    return windows.remove(targetWindow.id);
  });

  it('follows link by `f`', () => {
    let targetTab;
    return tabs.create(targetWindow.id, CLIENT_URL + '/follow').then((tab) => {
      targetTab = tab;
      return keys.press(targetTab.id, 'f');
    }).then(() => {
      return new Promise(resolve => { setTimeout(() => resolve(), 10) });
    }).then(() => {
      return keys.press(targetTab.id, 'a');
    }).then(() => {
      return new Promise(resolve => { setTimeout(() => resolve(), 10) });
    }).then(() => {
      return tabs.get(targetTab.id);
    }).then((tab) => {
      expect(tab.url).to.be.equal(CLIENT_URL + '/follow#a');
    });
  });

  it('follows link into new tab by `F`', () => {
    let targetTab;
    return tabs.create(targetWindow.id, CLIENT_URL + '/follow').then((tab) => {
      targetTab = tab;
      return keys.press(targetTab.id, 'F', { shiftKey: true });
    }).then(() => {
      return new Promise(resolve => { setTimeout(() => resolve(), 10) });
    }).then(() => {
      return keys.press(targetTab.id, 'a');
    }).then(() => {
      return new Promise(resolve => { setTimeout(() => resolve(), 500) });
    }).then(() => {
      return windows.get(targetWindow.id);
    }).then((win) => {
      let urls = win.tabs.map(t => t.url);
      expect(urls).to.have.lengthOf(3);
      expect(urls).to.include(CLIENT_URL + '/');
      expect(urls).to.include(CLIENT_URL + '/follow');
      expect(urls).to.include(CLIENT_URL + '/follow#a');
    });
  });

  it('follows link with target=_blank into new tab by `f`', () => {
    let targetTab;
    return tabs.create(targetWindow.id, CLIENT_URL + '/follow').then((tab) => {
      targetTab = tab;
      return keys.press(targetTab.id, 'f');
    }).then(() => {
      return new Promise(resolve => { setTimeout(() => resolve(), 10) });
    }).then(() => {
      return keys.press(targetTab.id, 'b');
    }).then(() => {
      return new Promise(resolve => { setTimeout(() => resolve(), 500) });
    }).then(() => {
      return windows.get(targetWindow.id);
    }).then((win) => {
      let urls = win.tabs.map(t => t.url);
      expect(urls).to.have.lengthOf(3);
      expect(urls).to.include(CLIENT_URL + '/');
      expect(urls).to.include(CLIENT_URL + '/follow');
      expect(urls).to.include(CLIENT_URL + '/follow#external');
    });
  });

  it('follows link with target=_blank into new tab by `F`', () => {
    let targetTab;
    return tabs.create(targetWindow.id, CLIENT_URL + '/follow').then((tab) => {
      targetTab = tab;
      return keys.press(targetTab.id, 'F', { shiftKey: true });
    }).then(() => {
    }).then(() => {
      return new Promise(resolve => { setTimeout(() => resolve(), 10) });
    }).then(() => {
      return keys.press(targetTab.id, 'b');
    }).then(() => {
      return new Promise(resolve => { setTimeout(() => resolve(), 500) });
    }).then(() => {
      return windows.get(targetWindow.id);
    }).then((win) => {
      let urls = win.tabs.map(t => t.url);
      expect(urls).to.have.lengthOf(3);
      expect(urls).to.include(CLIENT_URL + '/');
      expect(urls).to.include(CLIENT_URL + '/follow');
      expect(urls).to.include(CLIENT_URL + '/follow#external');
    });
  });

  it('follows area by `F`', () => {
    let targetTab;
    return tabs.create(targetWindow.id, CLIENT_URL + '/follow').then((tab) => {
      targetTab = tab;
      return keys.press(targetTab.id, 'f');
    }).then(() => {
      return new Promise(resolve => { setTimeout(() => resolve(), 10) });
    }).then(() => {
      return keys.press(targetTab.id, 'c');
    }).then(() => {
      return new Promise(resolve => { setTimeout(() => resolve(), 10) });
    }).then(() => {
      return tabs.get(targetTab.id);
    }).then((tab) => {
      expect(tab.url).to.be.equal(CLIENT_URL + '/follow#area');
    });
  });
});
