/**
 * @jest-environment jsdom
 */

import InputDriver, {
  keyFromKeyboardEvent,
} from "../../src/content/InputDriver";
import { expect } from "chai";
import Key from "../../src/shared/settings/Key";

describe("InputDriver", () => {
  let target: HTMLElement;
  let driver: InputDriver;

  beforeEach(() => {
    target = document.createElement("div");
    document.body.appendChild(target);
    driver = new InputDriver(target);
  });

  afterEach(() => {
    target.remove();
  });

  it("register callbacks", (done) => {
    driver.onKey((key: Key): boolean => {
      expect(key.key).to.equal("a");
      expect(key.ctrl).to.be.true;
      expect(key.shift).to.be.false;
      expect(key.alt).to.be.false;
      expect(key.meta).to.be.false;
      done();
      return true;
    });

    target.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "a",
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      })
    );
  });

  it("invoke callback once", () => {
    let a = 0,
      b = 0;
    driver.onKey((key: Key): boolean => {
      if (key.key == "a") {
        ++a;
      } else {
        key.key == "b";
        ++b;
      }
      return true;
    });

    const events = [
      new KeyboardEvent("keydown", { key: "a" }),
      new KeyboardEvent("keydown", { key: "b" }),
      new KeyboardEvent("keypress", { key: "a" }),
      new KeyboardEvent("keyup", { key: "a" }),
      new KeyboardEvent("keypress", { key: "b" }),
      new KeyboardEvent("keyup", { key: "b" }),
    ];
    for (const e of events) {
      target.dispatchEvent(e);
    }

    expect(a).to.equal(1);
    expect(b).to.equal(1);
  });

  it("propagates and stop handler chain", () => {
    let a = 0,
      b = 0,
      c = 0;
    driver.onKey((_key: Key): boolean => {
      a++;
      return false;
    });
    driver.onKey((_key: Key): boolean => {
      b++;
      return true;
    });
    driver.onKey((_key: Key): boolean => {
      c++;
      return true;
    });

    target.dispatchEvent(new KeyboardEvent("keydown", { key: "b" }));

    expect(a).to.equal(1);
    expect(b).to.equal(1);
    expect(c).to.equal(0);
  });

  it("does not invoke only meta keys", () => {
    driver.onKey((_key: Key): boolean => {
      expect.fail();
      return false;
    });

    target.dispatchEvent(new KeyboardEvent("keydown", { key: "Shift" }));
    target.dispatchEvent(new KeyboardEvent("keydown", { key: "Control" }));
    target.dispatchEvent(new KeyboardEvent("keydown", { key: "Alt" }));
    target.dispatchEvent(new KeyboardEvent("keydown", { key: "OS" }));
  });

  it("ignores events from input elements", () => {
    ["input", "textarea", "select"].forEach((name) => {
      const input = window.document.createElement(name);
      const driver = new InputDriver(input);
      driver.onKey((_key: Key): boolean => {
        expect.fail();
        return false;
      });
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "x" }));
    });
  });

  it("ignores events from contenteditable elements", () => {
    const div = window.document.createElement("div");
    const driver = new InputDriver(div);
    driver.onKey((_key: Key): boolean => {
      expect.fail();
      return false;
    });

    div.setAttribute("contenteditable", "");
    div.dispatchEvent(new KeyboardEvent("keydown", { key: "x" }));

    div.setAttribute("contenteditable", "true");
    div.dispatchEvent(new KeyboardEvent("keydown", { key: "x" }));
  });
});

describe("#keyFromKeyboardEvent", () => {
  it("returns from keyboard input Ctrl+X", () => {
    const k = keyFromKeyboardEvent(
      new KeyboardEvent("keydown", {
        key: "x",
        shiftKey: false,
        ctrlKey: true,
        altKey: false,
        metaKey: true,
      })
    );
    expect(k.key).to.equal("x");
    expect(k.shift).to.be.false;
    expect(k.ctrl).to.be.true;
    expect(k.alt).to.be.false;
    expect(k.meta).to.be.true;
  });

  it("returns from keyboard input Shift+Esc", () => {
    const k = keyFromKeyboardEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        shiftKey: true,
        ctrlKey: false,
        altKey: false,
        metaKey: true,
      })
    );
    expect(k.key).to.equal("Esc");
    expect(k.shift).to.be.true;
    expect(k.ctrl).to.be.false;
    expect(k.alt).to.be.false;
    expect(k.meta).to.be.true;
  });

  it("returns from keyboard input Ctrl+$", () => {
    // $ required shift pressing on most keyboards
    const k = keyFromKeyboardEvent(
      new KeyboardEvent("keydown", {
        key: "$",
        shiftKey: true,
        ctrlKey: true,
        altKey: false,
        metaKey: false,
      })
    );
    expect(k.key).to.equal("$");
    expect(k.shift).to.be.false;
    expect(k.ctrl).to.be.true;
    expect(k.alt).to.be.false;
    expect(k.meta).to.be.false;
  });

  it("returns from keyboard input Crtl+Space", () => {
    const k = keyFromKeyboardEvent(
      new KeyboardEvent("keydown", {
        key: " ",
        shiftKey: false,
        ctrlKey: true,
        altKey: false,
        metaKey: false,
      })
    );
    expect(k.key).to.equal("Space");
    expect(k.shift).to.be.false;
    expect(k.ctrl).to.be.true;
    expect(k.alt).to.be.false;
    expect(k.meta).to.be.false;
  });
});
