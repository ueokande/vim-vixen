import Settings from "../../../src/shared/settings/Settings";
import { expect } from "chai";

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
      }).to.deep.equal({
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
      expect(value.keymaps.toJSON()).to.not.be.empty;
      expect(value.properties.toJSON()).to.not.be.empty;
      expect(value.search.defaultEngine).to.be.a("string");
      expect(value.search.engines).to.be.an("object");
      expect(value.blacklist.toJSON()).to.be.empty;
    });

    it("throws a TypeError with an unknown field", () => {
      expect(() => Settings.fromJSON({ name: "alice" })).to.throw(TypeError);
    });
  });
});
