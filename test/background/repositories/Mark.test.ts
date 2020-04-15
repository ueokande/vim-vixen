import MarkRepository from "../../../src/background/repositories/MarkRepository";
import { expect } from "chai";

describe("background/repositories/mark", () => {
  let repository: MarkRepository;

  beforeEach(() => {
    repository = new MarkRepository();
  });

  it("get and set", async () => {
    const mark = { tabId: 1, url: "http://example.com", x: 10, y: 30 };

    await repository.setMark("A", mark);

    let got = (await repository.getMark("A"))!!;
    expect(got.tabId).to.equal(1);
    expect(got.url).to.equal("http://example.com");
    expect(got.x).to.equal(10);
    expect(got.y).to.equal(30);

    got = (await repository.getMark("B"))!!;
    expect(got).to.be.undefined;
  });
});
