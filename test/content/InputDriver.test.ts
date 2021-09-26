/**
 * @jest-environment jsdom
 */

import InputDriver, {
  keyFromKeyboardEvent,
} from "../../src/content/InputDriver";
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
      expect(key.key).toEqual("a");
      expect(key.ctrl).toBeTruthy;
      expect(key.shift).toBeFalsy;
      expect(key.alt).toBeFalsy;
      expect(key.meta).toBeFalsy;
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

    expect(a).toEqual(1);
    expect(b).toEqual(1);
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

    expect(a).toEqual(1);
    expect(b).toEqual(1);
    expect(c).toEqual(0);
  });

  it("does not invoke only meta keys", () => {
    driver.onKey((_key: Key): boolean => {
      throw new Error("unexpected reach");
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
        throw new Error("unexpected reach");
        return false;
      });
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "x" }));
    });
  });

  it("ignores events from contenteditable elements", () => {
    const div = window.document.createElement("div");
    const driver = new InputDriver(div);
    driver.onKey((_key: Key): boolean => {
      throw new Error("unexpected reach");
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
    expect(k.key).toEqual("x");
    expect(k.shift).toBeFalsy;
    expect(k.ctrl).toBeTruthy;
    expect(k.alt).toBeFalsy;
    expect(k.meta).toBeTruthy;
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
    expect(k.key).toEqual("Esc");
    expect(k.shift).toBeTruthy;
    expect(k.ctrl).toBeFalsy;
    expect(k.alt).toBeFalsy;
    expect(k.meta).toBeTruthy;
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
    expect(k.key).toEqual("$");
    expect(k.shift).toBeFalsy;
    expect(k.ctrl).toBeTruthy;
    expect(k.alt).toBeFalsy;
    expect(k.meta).toBeFalsy;
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
    expect(k.key).toEqual("Space");
    expect(k.shift).toBeFalsy;
    expect(k.ctrl).toBeTruthy;
    expect(k.alt).toBeFalsy;
    expect(k.meta).toBeFalsy;
  });
});
