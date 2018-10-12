import GlobalMark from 'background/domains/global-mark';

describe('background/domains/global-mark', () => {
  describe('constructor and getter', () => {
    let mark = new GlobalMark(1, 'http://example.com', 10, 30);
    expect(mark.tabId).to.equal(1);
    expect(mark.url).to.equal('http://example.com');
    expect(mark.x).to.equal(10);
    expect(mark.y).to.equal(30);
  });
});
