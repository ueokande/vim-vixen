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

  it('scrolls up by k', () => {
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

  it('scrolls down by j', () => {
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

  it('scrolls left by h', () => {
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

  it('scrolls top by gg', () => {
    return scrolls.set(targetTab.id, 100, 100).then((scroll) => {
      return keys.press(targetTab.id, 'g');
    }).then(() => {
      return keys.press(targetTab.id, 'g');
    }).then(() => {
      return scrolls.get(targetTab.id);
    }).then((actual) => {
      expect(actual.y).to.be.equals(0);
    });
  });

  it('scrolls bottom by G', () => {
    return scrolls.set(targetTab.id, 100, 100).then((scroll) => {
      return keys.press(targetTab.id, 'G', { shiftKey: true });
    }).then(() => {
      return scrolls.get(targetTab.id);
    }).then((actual) => {
      expect(actual.y).to.be.equals(actual.yMax);
    });
  });

  it('scrolls bottom by 0', () => {
    return scrolls.set(targetTab.id, 100, 100).then((scroll) => {
      return keys.press(targetTab.id, '0');
    }).then(() => {
      return scrolls.get(targetTab.id);
    }).then((actual) => {
      expect(actual.x).to.be.equals(0);
    });
  });

  it('scrolls bottom by $', () => {
    return scrolls.set(targetTab.id, 100, 100).then((scroll) => {
      return keys.press(targetTab.id, '$');
    }).then(() => {
      return scrolls.get(targetTab.id);
    }).then((actual) => {
      expect(actual.x).to.be.equals(actual.xMax);
    });
  });

  it('scrolls bottom by <C-U>', () => {
    let before
    return scrolls.set(targetTab.id, 5000, 5000).then((scroll) => {
      before = scroll;
      return keys.press(targetTab.id, 'u', { ctrlKey: true });
    }).then(() => {
      return scrolls.get(targetTab.id);
    }).then((actual) => {
      expect(actual.y).to.closeTo(before.y - before.frameHeight / 2, 1);
    });
  });

  it('scrolls bottom by <C-D>', () => {
    let before
    return scrolls.set(targetTab.id, 5000, 5000).then((scroll) => {
      before = scroll;
      return keys.press(targetTab.id, 'd', { ctrlKey: true });
    }).then(() => {
      return scrolls.get(targetTab.id);
    }).then((actual) => {
      expect(actual.y).to.closeTo(before.y + before.frameHeight / 2, 1);
    });
  });

  it('scrolls bottom by <C-B>', () => {
    let before
    return scrolls.set(targetTab.id, 5000, 5000).then((scroll) => {
      before = scroll;
      return keys.press(targetTab.id, 'b', { ctrlKey: true });
    }).then(() => {
      return scrolls.get(targetTab.id);
    }).then((actual) => {
      expect(actual.y).to.equals(before.y - before.frameHeight);
    });
  });

  it('scrolls bottom by <C-F>', () => {
    let before
    return scrolls.set(targetTab.id, 5000, 5000).then((scroll) => {
      before = scroll;
      return keys.press(targetTab.id, 'f', { ctrlKey: true });
    }).then(() => {
      return scrolls.get(targetTab.id);
    }).then((actual) => {
      expect(actual.y).to.equals(before.y + before.frameHeight);
    });
  });
});
