import Settings from "../../../src/shared/settings/Settings";

describe("Settings", () => {
  describe("#valueOf", () => {
    it("returns settings by valid settings", () => {
      const x = Settings.fromJSON({
        keymaps: {},
        search: {
          default: "google",
          engines: {
            google: "https://google.com/search?q={}",
          },
        },
        properties: {},
        blacklist: [],
      });

      expect({
        keymaps: x.keymaps.toJSON(),
        search: x.search.toJSON(),
        properties: x.properties.toJSON(),
        blacklist: x.blacklist.toJSON(),
      }).toEqual({
        keymaps: {},
        search: {
          default: "google",
          engines: {
            google: "https://google.com/search?q={}",
          },
        },
        properties: {
          hintchars: "abcdefghijklmnopqrstuvwxyz",
          smoothscroll: false,
          complete: "sbh",
          colorscheme: "system",
        },
        blacklist: [],
      });
    });

    it("sets default settings", () => {
      const value = Settings.fromJSON({});
      expect(value.keymaps.toJSON()).not.toEqual({});
      expect(value.properties.toJSON()).not.toEqual({});
      expect(typeof value.search.defaultEngine).toEqual("string");
      expect(typeof value.search.engines).toEqual("object");
      expect(value.blacklist.toJSON()).toHaveLength(0);
    });

    it("throws a TypeError with an unknown field", () => {
      expect(() => Settings.fromJSON({ name: "alice" })).toThrow(TypeError);
    });
  });
});
