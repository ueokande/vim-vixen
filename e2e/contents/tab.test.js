import { expect } from "chai";
import * as windows from "../ambassador/src/client/windows";
import * as tabs from "../ambassador/src/client/tabs";
import * as keys from "../ambassador/src/client/keys";

const SERVER_URL = "localhost:11111";

describe("tab test", () => {
  let targetWindow;

  before(() => {
    return windows.create().then((win) => {
      targetWindow = win;
    });
  });

  after(() => {
    return windows.remove(targetWindow.id);
  });

  it('deletes tab by d', () => {
    let before;
    let targetTab;
    return tabs.create(targetWindow.id, SERVER_URL).then((tab) => {
      targetTab = tab;
      return windows.get(targetWindow.id);
    }).then((win) => {
      before = win;
      return keys.press(targetTab.id, 'd');
    }).then(() => {
      return windows.get(targetWindow.id);
    }).then((actual) => {
      expect(actual.tabs).to.have.lengthOf(before.tabs.length - 1);
    });
  });

  it('duplicates tab by zd', () => {
    let before;
    let targetTab;
    return tabs.create(targetWindow.id, SERVER_URL).then((tab) => {
      targetTab = tab;
      return windows.get(targetWindow.id)
    }).then((win) => {;
      before = win;
      return keys.press(targetTab.id, 'z');
    }).then(() => {
      return keys.press(targetTab.id, 'd');
    }).then(() => {
      return windows.get(targetWindow.id);
    }).then((actual) => {
      expect(actual.tabs).to.have.lengthOf(before.tabs.length + 1);
    });
  })
});
