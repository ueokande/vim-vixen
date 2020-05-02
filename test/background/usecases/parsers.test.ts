import * as parsers from "../../../src/background/usecases/parsers";
import { expect } from "chai";

describe("shared/commands/parsers", () => {
  describe("#parsers.parseSetOption", () => {
    it("parse set string", () => {
      const [key, value] = parsers.parseSetOption("hintchars=abcdefgh");
      expect(key).to.equal("hintchars");
      expect(value).to.equal("abcdefgh");
    });

    it("parse set empty string", () => {
      const [key, value] = parsers.parseSetOption("hintchars=");
      expect(key).to.equal("hintchars");
      expect(value).to.equal("");
    });

    it("parse set boolean", () => {
      let [key, value] = parsers.parseSetOption("smoothscroll");
      expect(key).to.equal("smoothscroll");
      expect(value).to.be.true;

      [key, value] = parsers.parseSetOption("nosmoothscroll");
      expect(key).to.equal("smoothscroll");
      expect(value).to.be.false;
    });

    it("throws error on unknown property", () => {
      expect(() => parsers.parseSetOption("encoding=utf-8")).to.throw(
        Error,
        "Unknown"
      );
      expect(() => parsers.parseSetOption("paste")).to.throw(Error, "Unknown");
      expect(() => parsers.parseSetOption("nopaste")).to.throw(
        Error,
        "Unknown"
      );
      expect(() => parsers.parseSetOption("smoothscroll=yes")).to.throw(
        Error,
        "Invalid argument"
      );
    });
  });
});
