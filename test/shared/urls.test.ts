import * as parsers from "../../src/shared/urls";
import Search from "../../src/shared/settings/Search";

describe("shared/commands/parsers", () => {
  describe("#searchUrl", () => {
    const config = Search.fromJSON({
      default: "google",
      engines: {
        google: "https://google.com/search?q={}",
        yahoo: "https://yahoo.com/search?q={}",
      },
    });

    it("convertes search url", () => {
      expect(parsers.searchUrl("google.com", config)).toEqual(
        "http://google.com"
      );
      expect(parsers.searchUrl("google apple", config)).toEqual(
        "https://google.com/search?q=apple"
      );
      expect(parsers.searchUrl("yahoo apple", config)).toEqual(
        "https://yahoo.com/search?q=apple"
      );
      expect(parsers.searchUrl("google apple banana", config)).toEqual(
        "https://google.com/search?q=apple%20banana"
      );
      expect(parsers.searchUrl("yahoo C++CLI", config)).toEqual(
        "https://yahoo.com/search?q=C%2B%2BCLI"
      );
    });

    it("user default  search engine", () => {
      expect(parsers.searchUrl("apple banana", config)).toEqual(
        "https://google.com/search?q=apple%20banana"
      );
    });

    it("searches with a word containing a colon", () => {
      expect(parsers.searchUrl("foo:", config)).toEqual(
        "https://google.com/search?q=foo%3A"
      );
      expect(parsers.searchUrl("std::vector", config)).toEqual(
        "https://google.com/search?q=std%3A%3Avector"
      );
    });

    it("localhost urls", () => {
      expect(parsers.searchUrl("localhost", config)).toEqual(
        "http://localhost"
      );
      expect(parsers.searchUrl("http://localhost", config)).toEqual(
        "http://localhost/"
      );
      expect(parsers.searchUrl("localhost:8080", config)).toEqual(
        "http://localhost:8080"
      );
      expect(parsers.searchUrl("localhost:80nan", config)).toEqual(
        "https://google.com/search?q=localhost%3A80nan"
      );
      expect(parsers.searchUrl("localhost 8080", config)).toEqual(
        "https://google.com/search?q=localhost%208080"
      );
      expect(parsers.searchUrl("localhost:80/build", config)).toEqual(
        "http://localhost:80/build"
      );
    });
  });

  describe("#normalizeUrl", () => {
    it("normalize urls", () => {
      expect(parsers.normalizeUrl("https://google.com/")).toEqual(
        "https://google.com/"
      );
      expect(parsers.normalizeUrl("google.com")).toEqual("http://google.com");
    });
  });
});
