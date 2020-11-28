import { HintKeyRepositoryImpl } from "../../../src/content/repositories/HintKeyRepository";
import { expect } from "chai";

describe("HintKeyProducerImpl class", () => {
  describe("#produce", () => {
    it("produce incremented keys", () => {
      const charset = "abc";
      const sequences = [
        "a",
        "b",
        "c",
        "aa",
        "ab",
        "ac",
        "ba",
        "bb",
        "bc",
        "ca",
        "cb",
        "cc",
        "aaa",
        "aab",
        "aac",
        "aba",
      ];

      const sut = new HintKeyRepositoryImpl();
      sut.reset(charset);
      for (let i = 0; i < sequences.length; ++i) {
        expect(sut.produce()).to.equal(sequences[i]);
      }
    });
  });

  describe("#reset", () => {
    it("resets charset", () => {
      const sut = new HintKeyRepositoryImpl();

      sut.reset("ab");
      expect(sut.produce()).to.equal("a");
      expect(sut.produce()).to.equal("b");

      sut.reset("xy");
      expect(sut.produce()).to.equal("x");
      expect(sut.produce()).to.equal("y");
    });
    it("throws an exception on empty charset", () => {
      const sut = new HintKeyRepositoryImpl();
      expect(() => sut.reset("")).to.throw(TypeError);
    });
  });
});
