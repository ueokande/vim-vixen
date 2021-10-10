import KeySequence from "../../../src/content/domains/KeySequence";
import Key from "../../../src/shared/settings/Key";

describe("KeySequence", () => {
  describe("#push", () => {
    it("append a key to the sequence", () => {
      const seq = new KeySequence([]);
      seq.push(Key.fromMapKey("g"));
      seq.push(Key.fromMapKey("<S-U>"));

      expect(seq.keys[0].key).toEqual("g");
      expect(seq.keys[1].key).toEqual("U");
      expect(seq.keys[1].shift).toBeTruthy;
    });
  });

  describe("#startsWith", () => {
    it("returns true if the key sequence starts with param", () => {
      const seq = new KeySequence([
        Key.fromMapKey("g"),
        Key.fromMapKey("<S-U>"),
      ]);

      expect(seq.startsWith(new KeySequence([]))).toBeTruthy;
      expect(seq.startsWith(new KeySequence([Key.fromMapKey("g")]))).toBeTruthy;
      expect(
        seq.startsWith(
          new KeySequence([Key.fromMapKey("g"), Key.fromMapKey("<S-U>")])
        )
      ).toBeTruthy;
      expect(
        seq.startsWith(
          new KeySequence([
            Key.fromMapKey("g"),
            Key.fromMapKey("<S-U>"),
            Key.fromMapKey("x"),
          ])
        )
      ).toBeFalsy;
      expect(seq.startsWith(new KeySequence([Key.fromMapKey("h")]))).toBeFalsy;
    });

    it("returns true if the empty sequence starts with an empty sequence", () => {
      const seq = new KeySequence([]);

      expect(seq.startsWith(new KeySequence([]))).toBeTruthy;
      expect(seq.startsWith(new KeySequence([Key.fromMapKey("h")]))).toBeFalsy;
    });
  });

  describe("#isDigitOnly", () => {
    it("returns true the keys are only digits", () => {
      expect(
        new KeySequence([
          new Key({ key: "4" }),
          new Key({ key: "0" }),
        ]).isDigitOnly()
      ).toBeTruthy;
      expect(
        new KeySequence([
          new Key({ key: "4" }),
          new Key({ key: "0" }),
          new Key({ key: "z" }),
        ]).isDigitOnly()
      ).toBeFalsy;
    });
  });

  describe("#repeatCount", () => {
    it("returns repeat count with a numeric prefix", () => {
      let seq = new KeySequence([
        new Key({ key: "1" }),
        new Key({ key: "0" }),
        new Key({ key: "g" }),
        new Key({ key: "g" }),
      ]);
      expect(seq.repeatCount()).toEqual(10);

      seq = new KeySequence([
        new Key({ key: "0" }),
        new Key({ key: "5" }),
        new Key({ key: "g" }),
        new Key({ key: "g" }),
      ]);
      expect(seq.repeatCount()).toEqual(5);
    });

    it("returns 1 if no numeric prefix", () => {
      let seq = new KeySequence([new Key({ key: "g" }), new Key({ key: "g" })]);
      expect(seq.repeatCount()).toEqual(1);

      seq = new KeySequence([]);
      expect(seq.repeatCount()).toEqual(1);
    });

    it("returns whole keys if digits only sequence", () => {
      let seq = new KeySequence([new Key({ key: "1" }), new Key({ key: "0" })]);
      expect(seq.repeatCount()).toEqual(10);

      seq = new KeySequence([new Key({ key: "0" }), new Key({ key: "5" })]);
      expect(seq.repeatCount()).toEqual(5);
    });
  });

  describe("#trimNumericPrefix", () => {
    it("removes numeric prefix", () => {
      const seq = new KeySequence([
        new Key({ key: "1" }),
        new Key({ key: "0" }),
        new Key({ key: "g" }),
        new Key({ key: "g" }),
        new Key({ key: "3" }),
      ]).trimNumericPrefix();
      expect(seq.keys.map((key) => key.key)).toEqual(["g", "g", "3"]);
    });

    it("returns empty if keys contains only digis", () => {
      const seq = new KeySequence([
        new Key({ key: "1" }),
        new Key({ key: "0" }),
      ]).trimNumericPrefix();
      expect(seq.trimNumericPrefix().keys).toHaveLength(0);
    });

    it("returns itself if no numeric prefix", () => {
      const seq = new KeySequence([
        new Key({ key: "g" }),
        new Key({ key: "g" }),
        new Key({ key: "3" }),
      ]).trimNumericPrefix();

      expect(seq.keys.map((key) => key.key)).toEqual(["g", "g", "3"]);
    });
  });

  describe("#splitNumericPrefix", () => {
    it("splits numeric prefix", () => {
      expect(KeySequence.fromMapKeys("10gg").splitNumericPrefix()).toEqual([
        KeySequence.fromMapKeys("10"),
        KeySequence.fromMapKeys("gg"),
      ]);
      expect(KeySequence.fromMapKeys("10").splitNumericPrefix()).toEqual([
        KeySequence.fromMapKeys("10"),
        new KeySequence([]),
      ]);
      expect(KeySequence.fromMapKeys("gg").splitNumericPrefix()).toEqual([
        new KeySequence([]),
        KeySequence.fromMapKeys("gg"),
      ]);
    });
  });

  describe("#fromMapKeys", () => {
    it("returns mapped keys for Shift+Esc", () => {
      const keys = KeySequence.fromMapKeys("<S-Esc>").keys;
      expect(keys).toHaveLength(1);
      expect(keys[0].key).toEqual("Esc");
      expect(keys[0].shift).toBeTruthy;
    });

    it("returns mapped keys for a<C-B><A-C>d<M-e>", () => {
      const keys = KeySequence.fromMapKeys("a<C-B><A-C>d<M-e>").keys;
      expect(keys).toHaveLength(5);
      expect(keys[0].key).toEqual("a");
      expect(keys[1].ctrl).toBeTruthy;
      expect(keys[1].key).toEqual("b");
      expect(keys[2].alt).toBeTruthy;
      expect(keys[2].key).toEqual("c");
      expect(keys[3].key).toEqual("d");
      expect(keys[4].meta).toBeTruthy;
      expect(keys[4].key).toEqual("e");
    });
  });
});
