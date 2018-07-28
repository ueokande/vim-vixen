import * as parsers from 'shared/urls';

describe("shared/commands/parsers", () => {
  describe('#normalizeUrl', () => {
    const config = {
      default: 'google',
      engines: {
        google: 'https://google.com/search?q={}',
        yahoo: 'https://yahoo.com/search?q={}',
      }
    };

    it('convertes search url', () => {
      expect(parsers.normalizeUrl('google apple', config))
        .to.equal('https://google.com/search?q=apple');
      expect(parsers.normalizeUrl('yahoo apple', config))
        .to.equal('https://yahoo.com/search?q=apple');
      expect(parsers.normalizeUrl('google apple banana', config))
        .to.equal('https://google.com/search?q=apple%20banana');
      expect(parsers.normalizeUrl('yahoo C++CLI', config))
        .to.equal('https://yahoo.com/search?q=C%2B%2BCLI');
    });

    it('user default  search engine', () => {
      expect(parsers.normalizeUrl('apple banana', config))
        .to.equal('https://google.com/search?q=apple%20banana');
    });
  });
});

