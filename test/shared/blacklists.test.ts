import { includes } from 'shared/blacklists';

describe("shared/blacklist", () => {
  it('matches by *', () => {
    let blacklist = ['*'];

    expect(includes(blacklist, 'https://github.com/abc')).to.be.true;
  })

  it('matches by hostname', () => {
    let blacklist = ['github.com'];

    expect(includes(blacklist, 'https://github.com')).to.be.true;
    expect(includes(blacklist, 'https://gist.github.com')).to.be.false;
    expect(includes(blacklist, 'https://github.com/ueokande')).to.be.true;
    expect(includes(blacklist, 'https://github.org')).to.be.false;
    expect(includes(blacklist, 'https://google.com/search?q=github.org')).to.be.false;
  })

  it('matches by hostname with wildcard', () => {
    let blacklist = ['*.github.com'];

    expect(includes(blacklist, 'https://github.com')).to.be.false;
    expect(includes(blacklist, 'https://gist.github.com')).to.be.true;
  })

  it('matches by path', () => {
    let blacklist = ['github.com/abc'];

    expect(includes(blacklist, 'https://github.com/abc')).to.be.true;
    expect(includes(blacklist, 'https://github.com/abcdef')).to.be.false;
    expect(includes(blacklist, 'https://gist.github.com/abc')).to.be.false;
  })

  it('matches by path with wildcard', () => {
    let blacklist = ['github.com/abc*'];

    expect(includes(blacklist, 'https://github.com/abc')).to.be.true;
    expect(includes(blacklist, 'https://github.com/abcdef')).to.be.true;
    expect(includes(blacklist, 'https://gist.github.com/abc')).to.be.false;
  })

  it('matches address and port', () => {
    let blacklist = ['127.0.0.1:8888'];

    expect(includes(blacklist, 'http://127.0.0.1:8888/')).to.be.true;
    expect(includes(blacklist, 'http://127.0.0.1:8888/hello')).to.be.true;
  })
});
