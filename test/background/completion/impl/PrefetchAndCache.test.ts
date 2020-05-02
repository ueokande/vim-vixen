import PrefetchAndCache, {
  shortKey,
} from "../../../../src/background/completion/impl/PrefetchAndCache";
import { expect } from "chai";

class MockRepository {
  public history: string[] = [];

  constructor(private items: string[]) {}

  get(query: string): Promise<string[]> {
    this.history.push(query);
    if (query.length === 0) {
      return Promise.resolve(this.items);
    } else {
      return Promise.resolve(this.items.filter((item) => item.includes(query)));
    }
  }
}
const filter = (items: string[], query: string) =>
  query.length === 0 ? items : items.filter((item) => item.includes(query));

describe("shortKey", () => {
  it("returns query excluding the last word", () => {
    const query = "hello\t world    good bye";
    const shorten = shortKey(query);
    expect(shorten).to.equal("hello world good");
  });

  it("returns half-length of the query", () => {
    const query = "the-query-with-super-long-word";
    const shorten = shortKey(query);
    expect(shorten).to.equal("the-query-with-");
  });

  it("returns shorten URL", () => {
    let query = "https://example.com/path/to/resource?q=hello";
    let shorten = shortKey(query);
    expect(shorten).to.equal("https://example.com/path/to/");

    query = "https://example.com/path/to/resource/#id1";
    shorten = shortKey(query);
    expect(shorten).to.equal("https://example.com/path/to/");

    query = "https://www.google.c";
    shorten = shortKey(query);
    expect(shorten).to.equal("https://ww");
  });
});

describe("PrefetchAndCache", () => {
  describe("get", () => {
    it("returns cached request", async () => {
      const repo = new MockRepository([
        "apple",
        "apple pie",
        "apple juice",
        "banana",
        "banana pudding",
        "cherry",
      ]);
      const sut = new PrefetchAndCache(repo.get.bind(repo), filter);

      expect(await sut.get("apple pie")).deep.equal(["apple pie"]);
      expect(await sut.get("apple ")).deep.equal([
        "apple",
        "apple pie",
        "apple juice",
      ]);
      expect(await sut.get("apple")).deep.equal([
        "apple",
        "apple pie",
        "apple juice",
      ]);
      expect(await sut.get("appl")).deep.equal([
        "apple",
        "apple pie",
        "apple juice",
      ]);
      expect(repo.history).to.deep.equal(["apple", "ap"]);

      expect(await sut.get("banana")).deep.equal(["banana", "banana pudding"]);
      expect(repo.history).to.deep.equal(["apple", "ap", "ban"]);
      expect(await sut.get("banana p")).deep.equal(["banana pudding"]);
      expect(repo.history).to.deep.equal(["apple", "ap", "ban", "banana"]);
      expect(await sut.get("ba")).deep.equal(["banana", "banana pudding"]);
      expect(repo.history).to.deep.equal(["apple", "ap", "ban", "banana", "b"]);

      expect(await sut.get("")).to.have.lengthOf(6);
      expect(repo.history).to.deep.equal([
        "apple",
        "ap",
        "ban",
        "banana",
        "b",
        "",
      ]);
    });
  });
});
