import * as windows from "../ambassador/src/client/windows";
import * as tabs from "../ambassador/src/client/tabs";
import * as keys from "../ambassador/src/client/keys";
import * as scrolls from "../ambassador/src/client/scrolls";
import { CLIENT_URL } from '../web-server/url';

describe("navigate test", () => {
  let targetWindow;

  before(() => {
    return windows.create().then((win) => {
      targetWindow = win;
      return tabs.create(targetWindow.id, CLIENT_URL);
    });
  });

  after(() => {
    return windows.remove(targetWindow.id);
  });

  it('goes to parent', () => {
    let targetTab;
    return tabs.create(targetWindow.id, CLIENT_URL + '/a/b/c').then((tab) => {
      targetTab = tab;
      return keys.press(targetTab.id, 'g');
    }).then(() => {
      return keys.press(targetTab.id, 'u');
    }).then(() => {
      return tabs.get(targetTab.id);
    }).then((tab) => {
      expect(tab.url).to.be.equal(CLIENT_URL + '/a/b/');
    });
  });

  it('removes hash', () => {
    let targetTab;
    return tabs.create(targetWindow.id, CLIENT_URL + '/a/b/c#navigate').then((tab) => {
      targetTab = tab;
      return keys.press(targetTab.id, 'g');
    }).then(() => {
      return keys.press(targetTab.id, 'u');
    }).then(() => {
      return tabs.get(targetTab.id);
    }).then((tab) => {
      expect(tab.url).to.be.equal(CLIENT_URL + '/a/b/c#');
    });
  });

  it('goes to root', () => {
    let targetTab;
    return tabs.create(targetWindow.id, CLIENT_URL + '/a/b/c').then((tab) => {
      targetTab = tab;
      return keys.press(targetTab.id, 'g');
    }).then(() => {
      return keys.press(targetTab.id, 'U', { shiftKey: true });
    }).then(() => {
      return tabs.get(targetTab.id);
    }).then((tab) => {
      expect(tab.url).to.be.equal(CLIENT_URL + '/');
    });
  });

  it('goes back and forward in history', () => {
    let targetTab;
    return tabs.create(targetWindow.id, CLIENT_URL + '/#navigate').then((tab) => {
      targetTab = tab;
      return keys.press(targetTab.id, 'g');
    }).then(() => {
      return keys.press(targetTab.id, 'u');
    }).then(() => {
      return keys.press(targetTab.id, 'H', { shiftKey: true });
    }).then(() => {
      return new Promise(resolve => { setTimeout(() => resolve(), 10) });
    }).then(() => {
      return tabs.get(targetTab.id);
    }).then((tab) => {
      expect(tab.url, 'go back in history').to.be.equal(CLIENT_URL + '/#navigate');
    }).then(() => {
      return new Promise(resolve => { setTimeout(() => resolve(), 10) });
    }).then(() => {
      return keys.press(targetTab.id, 'L', { shiftKey: true });
    }).then(() => {
      return tabs.get(targetTab.id);
    }).then((tab) => {
      expect(tab.url, 'go next in history').to.be.equal(CLIENT_URL + '/#');
    });
  });

  it('goes previous page by <a>', () => {
    let targetTab;
    return tabs.create(targetWindow.id, CLIENT_URL + '/a-pagenation?page=10').then((tab) => {
      targetTab = tab;
      return keys.press(targetTab.id, '[');
    }).then(() => {
      return keys.press(targetTab.id, '[');
    }).then(() => {
      return new Promise(resolve => { setTimeout(() => resolve(), 10) });
    }).then(() => {
      return tabs.get(targetTab.id);
    }).then((tab) => {
      expect(tab.url).to.be.equal(CLIENT_URL + '/a-pagenation?page=9');
    });
  })

  it('goes next page by <a>', () => {
    let targetTab;
    return tabs.create(targetWindow.id, CLIENT_URL + '/a-pagenation?page=10').then((tab) => {
      targetTab = tab;
      return keys.press(targetTab.id, ']');
    }).then(() => {
      return keys.press(targetTab.id, ']');
    }).then(() => {
      return new Promise(resolve => { setTimeout(() => resolve(), 10) });
    }).then(() => {
      return tabs.get(targetTab.id);
    }).then((tab) => {
      expect(tab.url).to.be.equal(CLIENT_URL + '/a-pagenation?page=11');
    });
  })

  it('goes previous page by <link>', () => {
    let targetTab;
    return tabs.create(targetWindow.id, CLIENT_URL + '/link-pagenation?page=10').then((tab) => {
      targetTab = tab;
      return keys.press(targetTab.id, '[');
    }).then(() => {
      return keys.press(targetTab.id, '[');
    }).then(() => {
      return new Promise(resolve => { setTimeout(() => resolve(), 10) });
    }).then(() => {
      return tabs.get(targetTab.id);
    }).then((tab) => {
      expect(tab.url).to.be.equal(CLIENT_URL + '/link-pagenation?page=9');
    });
  })

  it('goes next page by <link>', () => {
    let targetTab;
    return tabs.create(targetWindow.id, CLIENT_URL + '/link-pagenation?page=10').then((tab) => {
      targetTab = tab;
      return keys.press(targetTab.id, ']');
    }).then(() => {
      return keys.press(targetTab.id, ']');
    }).then(() => {
      return new Promise(resolve => { setTimeout(() => resolve(), 10) });
    }).then(() => {
      return tabs.get(targetTab.id);
    }).then((tab) => {
      expect(tab.url).to.be.equal(CLIENT_URL + '/link-pagenation?page=11');
    });
  })
});
