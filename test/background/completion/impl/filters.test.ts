import * as filters from "../../../../src/background/completion/impl/filters";
import { expect } from "chai";

describe("background/usecases/filters", () => {
  describe("filterHttp", () => {
    it("filters http URLs duplicates to https hosts", () => {
      const pages = [
        { id: "0", url: "http://i-beam.org/foo" },
        { id: "1", url: "https://i-beam.org/bar" },
        { id: "2", url: "http://i-beam.net/hoge" },
        { id: "3", url: "http://i-beam.net/fuga" },
      ];
      const filtered = filters.filterHttp(pages);

      const urls = filtered.map((x) => x.url);
      expect(urls).to.deep.equal([
        "https://i-beam.org/bar",
        "http://i-beam.net/hoge",
        "http://i-beam.net/fuga",
      ]);
    });
  });

  describe("filterBlankTitle", () => {
    it("filters blank titles", () => {
      const pages = [
        { id: "0", title: "hello" },
        { id: "1", title: "" },
        { id: "2" },
      ];
      const filtered = filters.filterBlankTitle(pages);

      expect(filtered).to.deep.equal([{ id: "0", title: "hello" }]);
    });
  });

  describe("filterByTailingSlash", () => {
    it("filters duplicated pathname on tailing slash", () => {
      const pages = [
        { id: "0", url: "http://i-beam.org/content" },
        { id: "1", url: "http://i-beam.org/content/" },
        { id: "2", url: "http://i-beam.org/search" },
        { id: "3", url: "http://i-beam.org/search?q=apple_banana_cherry" },
      ];
      const filtered = filters.filterByTailingSlash(pages);

      const urls = filtered.map((x) => x.url);
      expect(urls).to.deep.equal([
        "http://i-beam.org/content",
        "http://i-beam.org/search",
        "http://i-beam.org/search?q=apple_banana_cherry",
      ]);
    });
  });

  describe("filterByPathname", () => {
    it("filters by length of pathname", () => {
      const pages = [
        { id: "0", url: "http://i-beam.org/search?q=apple" },
        { id: "1", url: "http://i-beam.org/search?q=apple_banana" },
        { id: "2", url: "http://i-beam.org/search?q=apple_banana_cherry" },
        { id: "3", url: "http://i-beam.net/search?q=apple" },
        { id: "4", url: "http://i-beam.net/search?q=apple_banana" },
        { id: "5", url: "http://i-beam.net/search?q=apple_banana_cherry" },
      ];
      const filtered = filters.filterByPathname(pages);
      expect(filtered).to.deep.equal([
        { id: "0", url: "http://i-beam.org/search?q=apple" },
        { id: "3", url: "http://i-beam.net/search?q=apple" },
      ]);
    });
  });

  describe("filterByOrigin", () => {
    it("filters by length of pathname", () => {
      const pages = [
        { id: "0", url: "http://i-beam.org/search?q=apple" },
        { id: "1", url: "http://i-beam.org/search?q=apple_banana" },
        { id: "2", url: "http://i-beam.org/search?q=apple_banana_cherry" },
        { id: "3", url: "http://i-beam.org/request?q=apple" },
        { id: "4", url: "http://i-beam.org/request?q=apple_banana" },
        { id: "5", url: "http://i-beam.org/request?q=apple_banana_cherry" },
      ];
      const filtered = filters.filterByOrigin(pages);
      expect(filtered).to.deep.equal([
        { id: "0", url: "http://i-beam.org/search?q=apple" },
      ]);
    });
  });
});
