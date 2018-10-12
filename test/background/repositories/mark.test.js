import MarkRepository from 'background/repositories/mark';
import GlobalMark from 'background/domains/global-mark';

describe("background/repositories/version", () => {
  let repository;

  beforeEach(() => {
    repository = new MarkRepository;
  });

  it('get and set', async() => {
    let mark = new GlobalMark(1, 10, 30);

    repository.setMark('A', mark);

    let got = await repository.getMark('A');
    expect(got).to.be.a('object');
    expect(got.tabId).to.equal(1);

    got = await repository.getMark('B');
    expect(got).to.be.undefined;
  });
});
