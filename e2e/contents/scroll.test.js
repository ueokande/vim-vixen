import { expect } from "chai";
import * as windows from "../ambassador/src/client/windows";
import * as tabs from "../ambassador/src/client/tabs";
import * as keys from "../ambassador/src/client/keys";
import * as scrolls from "../ambassador/src/client/scrolls";

const SERVER_URL = "localhost:11111";

describe("scroll test", () => {
  let targetWindow;
  let targetTab;

  before(() => {
    return windows.create().then((win) => {
      targetWindow = win;
      return tabs.create(targetWindow.id, SERVER_URL);
    }).then((tab) => {
      targetTab = tab;
    });
  });

  after(() => {
    return windows.remove(targetWindow.id);
  });

  describe('press k', () => {
    it('scrolls up', () => {
      let before
      return scrolls.set(targetTab.id, 100, 100).then((scroll) => {
        before = scroll;
        return keys.press(targetTab.id, 'k');
      }).then(() => {
        return scrolls.get(targetTab.id);
      }).then((actual) => {
        expect(actual.y).to.be.lessThan(before.y);
      });
    });
  });

  describe('press j', () => {
    it('scrolls down', () => {
      let before
      return scrolls.set(targetTab.id, 100, 100).then((scroll) => {
        before = scroll;
        return keys.press(targetTab.id, 'j');
      }).then(() => {
        return scrolls.get(targetTab.id);
      }).then((actual) => {
        expect(actual.y).to.be.greaterThan(before.y);
      });
    });
  });

  describe('press h', () => {
    it('scrolls left', () => {
      let before
      return scrolls.set(targetTab.id, 100, 100).then((scroll) => {
        before = scroll;
        return keys.press(targetTab.id, 'h');
      }).then(() => {
        return scrolls.get(targetTab.id);
      }).then((actual) => {
        expect(actual.x).to.be.lessThan(before.x);
      });
    });
  });

  describe('press l', () => {
    it('scrolls right', () => {
      let before
      return scrolls.set(targetTab.id, 100, 100).then((scroll) => {
        before = scroll;
        return keys.press(targetTab.id, 'l');
      }).then(() => {
        return scrolls.get(targetTab.id);
      }).then((actual) => {
        expect(actual.x).to.be.greaterThan(before.x);
      });
    });
  });
});
