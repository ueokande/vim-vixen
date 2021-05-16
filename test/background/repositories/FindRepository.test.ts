import { expect } from "chai";
import { FindRepositoryImpl } from "../../../src/background/repositories/FindRepository";

describe("background/repositories/FindRepositoryImpl", () => {
  let sut: FindRepositoryImpl;

  beforeEach(() => {
    sut = new FindRepositoryImpl();
  });

  describe("global keyword", () => {
    it("get and set a keyword", async () => {
      expect(await sut.getGlobalKeyword()).to.be.undefined;

      await sut.setGlobalKeyword("Hello, world");

      const keyword = await sut.getGlobalKeyword();
      expect(keyword).to.equal("Hello, world");
    });
  });

  describe("local state", () => {
    it("get and set a keyword", async () => {
      expect(await sut.getLocalState(10)).to.be.undefined;

      await sut.setLocalState(10, {
        keyword: "Hello, world",
        rangeData: [],
        highlightPosition: 0,
      });

      const state = await sut.getLocalState(10);
      expect(state?.keyword).to.equal("Hello, world");

      expect(await sut.getLocalState(20)).to.be.undefined;
    });
  });
});
