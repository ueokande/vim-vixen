import Key from "../../../src/shared/settings/Key";

describe("Key", () => {
  describe("fromMapKey", () => {
    it("return for X", () => {
      const key = Key.fromMapKey("x");
      expect(key.key).toEqual("x");
      expect(key.shift).toBeFalsy;
      expect(key.ctrl).toBeFalsy;
      expect(key.alt).toBeFalsy;
      expect(key.meta).toBeFalsy;
    });

    it("return for Shift+X", () => {
      const key = Key.fromMapKey("X");
      expect(key.key).toEqual("X");
      expect(key.shift).toBeTruthy;
      expect(key.ctrl).toBeFalsy;
      expect(key.alt).toBeFalsy;
      expect(key.meta).toBeFalsy;
    });

    it("return for Ctrl+X", () => {
      const key = Key.fromMapKey("<C-X>");
      expect(key.key).toEqual("x");
      expect(key.shift).toBeFalsy;
      expect(key.ctrl).toBeTruthy;
      expect(key.alt).toBeFalsy;
      expect(key.meta).toBeFalsy;
    });

    it("returns for Ctrl+Meta+X", () => {
      const key = Key.fromMapKey("<C-M-X>");
      expect(key.key).toEqual("x");
      expect(key.shift).toBeFalsy;
      expect(key.ctrl).toBeTruthy;
      expect(key.alt).toBeFalsy;
      expect(key.meta).toBeTruthy;
    });

    it("returns for Ctrl+Shift+x", () => {
      const key = Key.fromMapKey("<C-S-x>");
      expect(key.key).toEqual("X");
      expect(key.shift).toBeTruthy;
      expect(key.ctrl).toBeTruthy;
      expect(key.alt).toBeFalsy;
      expect(key.meta).toBeFalsy;
    });

    it("returns for Shift+Esc", () => {
      const key = Key.fromMapKey("<S-Esc>");
      expect(key.key).toEqual("Esc");
      expect(key.shift).toBeTruthy;
      expect(key.ctrl).toBeFalsy;
      expect(key.alt).toBeFalsy;
      expect(key.meta).toBeFalsy;
    });

    it("returns for Ctrl+Esc", () => {
      const key = Key.fromMapKey("<C-Esc>");
      expect(key.key).toEqual("Esc");
      expect(key.shift).toBeFalsy;
      expect(key.ctrl).toBeTruthy;
      expect(key.alt).toBeFalsy;
      expect(key.meta).toBeFalsy;
    });

    it("returns for Ctrl+Esc", () => {
      const key = Key.fromMapKey("<C-Space>");
      expect(key.key).toEqual("Space");
      expect(key.shift).toBeFalsy;
      expect(key.ctrl).toBeTruthy;
      expect(key.alt).toBeFalsy;
      expect(key.meta).toBeFalsy;
    });
  });

  describe("idDigit", () => {
    it("returns true if the key is a digit", () => {
      expect(new Key({ key: "0" }).isDigit()).toBeTruthy;
      expect(new Key({ key: "9" }).isDigit()).toBeTruthy;
      expect(new Key({ key: "9", alt: true }).isDigit()).toBeFalsy;

      expect(new Key({ key: "a" }).isDigit()).toBeFalsy;
      expect(new Key({ key: "０" }).isDigit()).toBeFalsy;
    });
  });

  describe("equals", () => {
    it("returns true if the keys are equivalent", () => {
      expect(
        new Key({
          key: "x",
          shift: false,
          ctrl: true,
          alt: false,
          meta: false,
        }).equals(
          new Key({
            key: "x",
            shift: false,
            ctrl: true,
            alt: false,
            meta: false,
          })
        )
      ).toBeTruthy;

      expect(
        new Key({
          key: "x",
          shift: false,
          ctrl: false,
          alt: false,
          meta: false,
        }).equals(
          new Key({
            key: "X",
            shift: true,
            ctrl: false,
            alt: false,
            meta: false,
          })
        )
      ).toBeFalsy;
    });
  });
});
