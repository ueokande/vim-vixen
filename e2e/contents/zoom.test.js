import { expect } from "chai";
import * as windows from "../ambassador/src/client/windows";
import * as tabs from "../ambassador/src/client/tabs";
import * as keys from "../ambassador/src/client/keys";

const SERVER_URL = "localhost:11111/";

describe("zoom test", () => {
  let targetWindow;
  let targetTab;

  before(() => {
    return windows.create(SERVER_URL).then((win) => {
      targetWindow = win;
    });
  });

  after(() => {
    return windows.remove(targetWindow.id);
  });

  beforeEach(() => {
    return tabs.create(targetWindow.id, SERVER_URL).then((tab) => {
      targetTab = tab;
    });
  });

  it('zooms-in by zi', () => {
    let before;
    return tabs.getZoom(targetTab.id).then((zoom) => {
      before = zoom;
      return keys.press(targetTab.id, 'z');
    }).then(() => {
      return keys.press(targetTab.id, 'i');
    }).then(() => {
      return tabs.getZoom(targetTab.id);
    }).then((actual) => {
      expect(actual).to.be.greaterThan(before);
    });
  });

  it('zooms-in by zo', () => {
    let before;
    return tabs.getZoom(targetTab.id).then((zoom) => {
      before = zoom;
      return keys.press(targetTab.id, 'z');
    }).then(() => {
      return keys.press(targetTab.id, 'o');
    }).then(() => {
      return tabs.getZoom(targetTab.id);
    }).then((actual) => {
      expect(actual).to.be.lessThan(before);
    });
  });

  it('zooms-in by zz', () => {
    let before;
    tabs.setZoom(targetTab.id, 1.5).then(() => {
      return tabs.getZoom(targetTab.id);
    }).then((zoom) => {
      before = zoom;
      return keys.press(targetTab.id, 'z');
    }).then(() => {
      return keys.press(targetTab.id, 'z');
    }).then(() => {
      return tabs.getZoom(targetTab.id);
    }).then((actual) => {
      expect(actual).to.be.lessThan(before);
      expect(actual).to.be.be(1);
    });
  });
});
