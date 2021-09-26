import Properties from "../../../src/shared/settings/Properties";
import ColorScheme from "../../../src/shared/ColorScheme";

describe("Properties", () => {
  describe("#propertiesValueOf", () => {
    it("returns with default properties by empty settings", () => {
      const props = Properties.fromJSON({});
      expect(props).toEqual({
        hintchars: "abcdefghijklmnopqrstuvwxyz",
        smoothscroll: false,
        complete: "sbh",
        colorscheme: "system",
      });
    });

    it("returns properties by valid settings", () => {
      const props = Properties.fromJSON({
        hintchars: "abcdefgh",
        smoothscroll: false,
        complete: "sbh",
        colorscheme: ColorScheme.System,
      });

      expect(props).toEqual({
        hintchars: "abcdefgh",
        smoothscroll: false,
        complete: "sbh",
        colorscheme: "system",
      });
    });
  });
});
