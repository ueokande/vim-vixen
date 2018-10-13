import MarkRepository from 'background/repositories/mark';
import GlobalMark from 'background/domains/global-mark';

describe('background/repositories/mark', () => {
  let repository;

  beforeEach(() => {
    repository = new MarkRepository;
  });

  it('get and set', async() => {
    let mark = new GlobalMark(1, 'http://example.com', 10, 30);

    repository.setMark('A', mark);

    let got = await repository.getMark('A');
    expect(got).to.be.a('object');
    expect(got.tabId).to.equal(1);
    expect(got.url).to.equal('http://example.com');
    expect(got.x).to.equal(10);
    expect(got.y).to.equal(30);

    got = await repository.getMark('B');
    expect(got).to.be.undefined;
  });
});
