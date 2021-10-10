import Keymaps from "../../../src/shared/settings/Keymaps";

describe("Keymaps", () => {
  describe("#valueOf", () => {
    it("returns empty object by empty settings", () => {
      const keymaps = Keymaps.fromJSON({}).toJSON();
      expect(keymaps).toEqual({});
    });

    it("returns keymaps by valid settings", () => {
      const keymaps = Keymaps.fromJSON({
        k: { type: "scroll.vertically", count: -1 },
        j: { type: "scroll.vertically", count: 1 },
      }).toJSON();

      expect(keymaps["k"]).toEqual({
        type: "scroll.vertically",
        count: -1,
      });
      expect(keymaps["j"]).toEqual({
        type: "scroll.vertically",
        count: 1,
      });
    });

    it("throws a TypeError by invalid settings", () => {
      expect(() =>
        Keymaps.fromJSON({
          k: { type: "invalid.operation" },
        })
      ).toThrow(TypeError);
    });
  });

  describe("#combine", () => {
    it("returns combined keymaps", () => {
      const keymaps = Keymaps.fromJSON({
        k: { type: "scroll.vertically", count: -1 },
        j: { type: "scroll.vertically", count: 1 },
      }).combine(
        Keymaps.fromJSON({
          n: { type: "find.next" },
          N: { type: "find.prev" },
        })
      );

      const entries = keymaps
        .entries()
        .sort(([name1], [name2]) => name1.localeCompare(name2));
      expect(entries).toEqual([
        ["j", { type: "scroll.vertically", count: 1 }],
        ["k", { type: "scroll.vertically", count: -1 }],
        ["n", { type: "find.next" }],
        ["N", { type: "find.prev" }],
      ]);
    });

    it("overrides current keymaps", () => {
      const keymaps = Keymaps.fromJSON({
        k: { type: "scroll.vertically", count: -1 },
        j: { type: "scroll.vertically", count: 1 },
      }).combine(
        Keymaps.fromJSON({
          n: { type: "find.next" },
          j: { type: "find.prev" },
        })
      );

      const entries = keymaps
        .entries()
        .sort(([name1], [name2]) => name1.localeCompare(name2));
      expect(entries).toEqual([
        ["j", { type: "find.prev" }],
        ["k", { type: "scroll.vertically", count: -1 }],
        ["n", { type: "find.next" }],
      ]);
    });
  });
});
