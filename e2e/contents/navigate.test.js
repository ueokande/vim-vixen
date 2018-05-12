import * as windows from "../ambassador/src/client/windows";
import * as tabs from "../ambassador/src/client/tabs";
import * as keys from "../ambassador/src/client/keys";
import * as scrolls from "../ambassador/src/client/scrolls";

const SERVER_URL = "http://localhost:11111";

describe("navigate test", () => {
  let targetWindow;

  before(() => {
    return windows.create().then((win) => {
      targetWindow = win;
      return tabs.create(targetWindow.id, SERVER_URL);
    });
  });

  after(() => {
    return windows.remove(targetWindow.id);
  });

  it('goes to parent', () => {
    let targetTab;
    return tabs.create(targetWindow.id, SERVER_URL + '/a/b/c').then((tab) => {
      targetTab = tab;
      return keys.press(targetTab.id, 'g');
    }).then(() => {
      return keys.press(targetTab.id, 'u');
    }).then(() => {
      return tabs.get(targetTab.id);
    }).then((tab) => {
      expect(tab.url).to.be.equal(SERVER_URL + '/a/b/');
    });
  });

  it('removes hash', () => {
    let targetTab;
    return tabs.create(targetWindow.id, SERVER_URL + '/a/b/c#navigate').then((tab) => {
      targetTab = tab;
      return keys.press(targetTab.id, 'g');
    }).then(() => {
      return keys.press(targetTab.id, 'u');
    }).then(() => {
      return tabs.get(targetTab.id);
    }).then((tab) => {
      expect(tab.url).to.be.equal(SERVER_URL + '/a/b/c#');
    });
  });

  it('goes to root', () => {
    let targetTab;
    return tabs.create(targetWindow.id, SERVER_URL + '/a/b/c').then((tab) => {
      targetTab = tab;
      return keys.press(targetTab.id, 'g');
    }).then(() => {
      return keys.press(targetTab.id, 'U', { shiftKey: true });
    }).then(() => {
      return tabs.get(targetTab.id);
    }).then((tab) => {
      expect(tab.url).to.be.equal(SERVER_URL + '/');
    });
  });
});
