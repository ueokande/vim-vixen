import * as parsers from "../../../src/background/usecases/parsers";

describe("shared/commands/parsers", () => {
  describe("#parsers.parseSetOption", () => {
    it("parse set string", () => {
      const [key, value] = parsers.parseSetOption("hintchars=abcdefgh");
      expect(key).toEqual("hintchars");
      expect(value).toEqual("abcdefgh");
    });

    it("parse set empty string", () => {
      const [key, value] = parsers.parseSetOption("hintchars=");
      expect(key).toEqual("hintchars");
      expect(value).toEqual("");
    });

    it("parse set boolean", () => {
      let [key, value] = parsers.parseSetOption("smoothscroll");
      expect(key).toEqual("smoothscroll");
      expect(value).toBeTruthy;

      [key, value] = parsers.parseSetOption("nosmoothscroll");
      expect(key).toEqual("smoothscroll");
      expect(value).toBeFalsy;
    });

    it("throws error on unknown property", () => {
      expect(() => parsers.parseSetOption("encoding=utf-8")).toThrowError(
        "Unknown"
      );
      expect(() => parsers.parseSetOption("paste")).toThrowError("Unknown");
      expect(() => parsers.parseSetOption("nopaste")).toThrowError("Unknown");
      expect(() => parsers.parseSetOption("smoothscroll=yes")).toThrowError(
        "Invalid argument"
      );
    });
  });
});
