import { FindRepositoryImpl } from "../../../src/content/repositories/FindRepository";
import { expect } from "chai";

describe("FindRepositoryImpl", () => {
  it("updates and gets last keyword", () => {
    const sut = new FindRepositoryImpl();

    expect(sut.getLastKeyword()).to.be.null;

    sut.setLastKeyword("monkey");

    expect(sut.getLastKeyword()).to.equal("monkey");
  });
});
