import MarkRepository from 'background/repositories/MarkRepository';
import GlobalMark from 'background/domains/GlobalMark';

describe('background/repositories/mark', () => {
  let repository;

  beforeEach(() => {
    repository = new MarkRepository;
  });

  it('get and set', async() => {
    const mark = { tabId: 1, url: 'http://example.com', x: 10, y: 30 };

    repository.setMark('A', mark);

    let got = await repository.getMark('A');
    expect(got.tabId).to.equal(1);
    expect(got.url).to.equal('http://example.com');
    expect(got.x).to.equal(10);
    expect(got.y).to.equal(30);

    got = await repository.getMark('B');
    expect(got).to.be.undefined;
  });
});
