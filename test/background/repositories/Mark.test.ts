import MarkRepository from "../../../src/background/repositories/MarkRepository";

describe("background/repositories/mark", () => {
  let repository: MarkRepository;

  beforeEach(() => {
    repository = new MarkRepository();
  });

  it("get and set", async () => {
    const mark = { tabId: 1, url: "http://example.com", x: 10, y: 30 };

    await repository.setMark("A", mark);

    let got = (await repository.getMark("A"))!;
    expect(got.tabId).toEqual(1);
    expect(got.url).toEqual("http://example.com");
    expect(got.x).toEqual(10);
    expect(got.y).toEqual(30);

    got = (await repository.getMark("B"))!;
    expect(got).toBeUndefined;
  });
});
