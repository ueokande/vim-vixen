import Blacklist, {
  BlacklistItem,
} from "../../../src/shared/settings/Blacklist";
import Key from "../../../src/shared/settings/Key";

describe("BlacklistItem", () => {
  describe("#fromJSON", () => {
    it("parses string pattern", () => {
      const item = BlacklistItem.fromJSON("example.com");
      expect(item.pattern).toEqual("example.com");
      expect(item.partial).toBeFalsy;
    });

    it("parses partial blacklist item", () => {
      const item = BlacklistItem.fromJSON({
        url: "example.com",
        keys: ["j", "k"],
      });
      expect(item.pattern).toEqual("example.com");
      expect(item.partial).toBeTruthy;
      expect(item.keys).toEqual(["j", "k"]);
    });
  });

  describe("#matches", () => {
    it('matches by "*"', () => {
      const item = BlacklistItem.fromJSON("*");
      expect(item.matches(new URL("https://github.com/abc"))).toBeTruthy;
    });

    it("matches by hostname", () => {
      const item = BlacklistItem.fromJSON("github.com");
      expect(item.matches(new URL("https://github.com"))).toBeTruthy;
      expect(item.matches(new URL("https://gist.github.com"))).toBeFalsy;
      expect(item.matches(new URL("https://github.com/ueokande"))).toBeTruthy;
      expect(item.matches(new URL("https://github.org"))).toBeFalsy;
      expect(item.matches(new URL("https://google.com/search?q=github.org")))
        .toBeFalsy;
    });

    it("matches by hostname with wildcard", () => {
      const item = BlacklistItem.fromJSON("*.github.com");

      expect(item.matches(new URL("https://github.com"))).toBeFalsy;
      expect(item.matches(new URL("https://gist.github.com"))).toBeTruthy;
    });

    it("matches by path", () => {
      const item = BlacklistItem.fromJSON("github.com/abc");

      expect(item.matches(new URL("https://github.com/abc"))).toBeTruthy;
      expect(item.matches(new URL("https://github.com/abcdef"))).toBeFalsy;
      expect(item.matches(new URL("https://gist.github.com/abc"))).toBeFalsy;
    });

    it("matches by path with wildcard", () => {
      const item = BlacklistItem.fromJSON("github.com/abc*");

      expect(item.matches(new URL("https://github.com/abc"))).toBeTruthy;
      expect(item.matches(new URL("https://github.com/abcdef"))).toBeTruthy;
      expect(item.matches(new URL("https://gist.github.com/abc"))).toBeFalsy;
    });

    it("matches address and port", () => {
      const item = BlacklistItem.fromJSON("127.0.0.1:8888");

      expect(item.matches(new URL("http://127.0.0.1:8888/"))).toBeTruthy;
      expect(item.matches(new URL("http://127.0.0.1:8888/hello"))).toBeTruthy;
    });

    it("matches with partial blacklist", () => {
      const item = BlacklistItem.fromJSON({
        url: "google.com",
        keys: ["j", "k"],
      });

      expect(item.matches(new URL("https://google.com"))).toBeTruthy;
      expect(item.matches(new URL("https://yahoo.com"))).toBeFalsy;
    });
  });

  describe("#includesPartialKeys", () => {
    it("matches with partial keys", () => {
      const item = BlacklistItem.fromJSON({
        url: "google.com",
        keys: ["j", "k", "<C-U>"],
      });

      expect(
        item.includeKey(new URL("http://google.com/maps"), Key.fromMapKey("j"))
      ).toBeTruthy;
      expect(
        item.includeKey(
          new URL("http://google.com/maps"),
          Key.fromMapKey("<C-U>")
        )
      ).toBeTruthy;
      expect(
        item.includeKey(new URL("http://google.com/maps"), Key.fromMapKey("z"))
      ).toBeFalsy;
      expect(
        item.includeKey(new URL("http://google.com/maps"), Key.fromMapKey("u"))
      ).toBeFalsy;
      expect(
        item.includeKey(new URL("http://maps.google.com/"), Key.fromMapKey("j"))
      ).toBeFalsy;
    });
  });
});

describe("Blacklist", () => {
  describe("#fromJSON", () => {
    it("parses string list", () => {
      const blacklist = Blacklist.fromJSON(["example.com", "example.org"]);
      expect(blacklist.toJSON()).toEqual(["example.com", "example.org"]);
    });

    it("parses mixed blacklist", () => {
      const blacklist = Blacklist.fromJSON([
        { url: "example.com", keys: ["j", "k"] },
        "example.org",
      ]);
      expect(blacklist.toJSON()).toEqual([
        { url: "example.com", keys: ["j", "k"] },
        "example.org",
      ]);
    });

    it("parses empty blacklist", () => {
      const blacklist = Blacklist.fromJSON([]);
      expect(blacklist.toJSON()).toEqual([]);
    });
  });

  describe("#includesEntireBlacklist", () => {
    it("matches a url with entire blacklist", () => {
      const blacklist = Blacklist.fromJSON(["google.com", "*.github.com"]);
      expect(blacklist.includesEntireBlacklist(new URL("https://google.com")))
        .toBeTruthy;
      expect(blacklist.includesEntireBlacklist(new URL("https://github.com")))
        .toBeFalsy;
      expect(
        blacklist.includesEntireBlacklist(new URL("https://gist.github.com"))
      ).toBeTruthy;
    });

    it("does not matches with partial blacklist", () => {
      const blacklist = Blacklist.fromJSON([
        "google.com",
        { url: "yahoo.com", keys: ["j", "k"] },
      ]);
      expect(blacklist.includesEntireBlacklist(new URL("https://google.com")))
        .toBeTruthy;
      expect(blacklist.includesEntireBlacklist(new URL("https://yahoo.com")))
        .toBeFalsy;
    });
  });

  describe("#includesKeys", () => {
    it("matches with entire blacklist or keys in the partial blacklist", () => {
      const blacklist = Blacklist.fromJSON([
        "google.com",
        { url: "github.com", keys: ["j", "k"] },
      ]);

      expect(
        blacklist.includeKey(new URL("https://google.com"), Key.fromMapKey("j"))
      ).toBeFalsy;
      expect(
        blacklist.includeKey(new URL("https://github.com"), Key.fromMapKey("j"))
      ).toBeTruthy;
      expect(
        blacklist.includeKey(new URL("https://github.com"), Key.fromMapKey("a"))
      ).toBeFalsy;
    });
  });
});
