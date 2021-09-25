import { expect } from "chai";
import { ReadyFrameRepositoryImpl } from "../../../src/background/repositories/ReadyFrameRepository";

describe("background/repositories/ReadyFrameRepositoryImpl", () => {
  let sut: ReadyFrameRepositoryImpl;

  beforeEach(() => {
    sut = new ReadyFrameRepositoryImpl();
  });

  it("get and set a keyword", async () => {
    expect(await sut.getFrameIds(1)).to.be.undefined;

    await sut.addFrameId(1, 10);
    await sut.addFrameId(1, 12);
    await sut.addFrameId(1, 11);
    await sut.addFrameId(2, 20);

    expect(await sut.getFrameIds(1)).to.deep.equal([10, 11, 12]);
    expect(await sut.getFrameIds(2)).to.deep.equal([20]);

    await sut.clearFrameIds(1);

    expect(await sut.getFrameIds(1)).to.be.undefined;
  });
});
