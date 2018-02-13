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

  describe('press d', () => {
    it('deletes tab', () => {
      return tabs.create(targetWindow.id, SERVER_URL).then((tab) => {
        return keys.press(tab.id, 'd');
      }).then(() => {
        return windows.get(targetWindow.id);
      }).then((after) => {
        expect(after.tabs).to.have.lengthOf(1);
      });
    });
  });

  describe('press zd', () => {
    it('duplicates tab', () => {
      let targetTab = 0;
      return tabs.create(targetWindow.id, SERVER_URL).then((tab) => {
        targetTab = tab;
        return keys.press(targetTab.id, 'z');
      }).then(() => {
        return keys.press(targetTab.id, 'd');
      }).then(() => {
        return windows.get(targetWindow.id);
      }).then((after) => {
        expect(after.tabs).to.have.lengthOf(3);
      });
    });
  })
});
