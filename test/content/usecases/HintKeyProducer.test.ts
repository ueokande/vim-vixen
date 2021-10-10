import { HintKeyRepositoryImpl } from "../../../src/content/repositories/HintKeyRepository";

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
        expect(sut.produce()).toEqual(sequences[i]);
      }
    });
  });

  describe("#reset", () => {
    it("resets charset", () => {
      const sut = new HintKeyRepositoryImpl();

      sut.reset("ab");
      expect(sut.produce()).toEqual("a");
      expect(sut.produce()).toEqual("b");

      sut.reset("xy");
      expect(sut.produce()).toEqual("x");
      expect(sut.produce()).toEqual("y");
    });
    it("throws an exception on empty charset", () => {
      const sut = new HintKeyRepositoryImpl();
      expect(() => sut.reset("")).toThrow(TypeError);
    });
  });
});
