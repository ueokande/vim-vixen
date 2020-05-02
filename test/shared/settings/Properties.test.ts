import Properties from "../../../src/shared/settings/Properties";
import { expect } from "chai";

describe("Properties", () => {
  describe("#propertiesValueOf", () => {
    it("returns with default properties by empty settings", () => {
      const props = Properties.fromJSON({});
      expect(props).to.deep.equal({
        hintchars: "abcdefghijklmnopqrstuvwxyz",
        smoothscroll: false,
        complete: "sbh",
      });
    });

    it("returns properties by valid settings", () => {
      const props = Properties.fromJSON({
        hintchars: "abcdefgh",
        smoothscroll: false,
        complete: "sbh",
      });

      expect(props).to.deep.equal({
        hintchars: "abcdefgh",
        smoothscroll: false,
        complete: "sbh",
      });
    });
  });
});
