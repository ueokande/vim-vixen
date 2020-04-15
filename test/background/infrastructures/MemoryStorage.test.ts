import MemoryStorage from "../../../src/background/infrastructures/MemoryStorage";
import { expect } from "chai";

describe("background/infrastructures/memory-storage", () => {
  it("stores values", () => {
    const cache = new MemoryStorage();
    cache.set("number", 123);
    expect(cache.get("number")).to.equal(123);

    cache.set("string", "123");
    expect(cache.get("string")).to.equal("123");

    cache.set("object", { hello: "123" });
    expect(cache.get("object")).to.deep.equal({ hello: "123" });
  });

  it("returns undefined if no keys", () => {
    const cache = new MemoryStorage();
    expect(cache.get("no-keys")).to.be.undefined;
  });

  it("stored on shared memory", () => {
    let cache = new MemoryStorage();
    cache.set("red", "apple");

    cache = new MemoryStorage();
    const got = cache.get("red");
    expect(got).to.equal("apple");
  });

  it("stored cloned objects", () => {
    const cache = new MemoryStorage();
    const recipe = { sugar: "300g", salt: "10g" };
    cache.set("recipe", recipe);

    recipe.salt = "20g";
    const got = cache.get("recipe");
    expect(got).to.deep.equal({ sugar: "300g", salt: "10g" });
  });

  it("throws an error with unserializable objects", () => {
    const cache = new MemoryStorage();
    expect(() => cache.set("fn", setTimeout)).to.throw();
  });
});
