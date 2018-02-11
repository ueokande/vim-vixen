import { expect } from "chai";
import * as windows from "../ambassador/src/client/windows";
import * as tabs from "../ambassador/src/client/tabs";
import * as keys from "../ambassador/src/client/keys";

const SERVER_URL = "localhost:11111";

describe("tab test", function() {
  let targetWindow;
  let targetTab;

  before(() => {
    return windows.create().then((win) => {
      targetWindow = win;
      return tabs.create(win.id, SERVER_URL).then((tab) => {
        targetTab = tab;
      });
    });
  });

  after(() => {
    return windows.remove(targetWindow.id);
  });

  it('delete tab', (done) => {
    let before = window.document.documentElement.scrollTop;
    keys.press(targetTab.id, 'j').then((r) => {
    });
    keys.press(targetTab.id, 'j').then((r) => {
    });
    keys.press(targetTab.id, 'G').then((r) => {
    });
    let after = window.document.documentElement.scrollTop;
  });
});
