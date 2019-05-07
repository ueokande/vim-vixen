import * as filters from 'background/usecases/filters';

describe("background/usecases/filters", () => {
  describe('filterHttp', () => {
    it('filters http URLs duplicates to https hosts', () => {
      let pages = [
        { url: 'http://i-beam.org/foo' },
        { url: 'https://i-beam.org/bar' },
        { url: 'http://i-beam.net/hoge' },
        { url: 'http://i-beam.net/fuga' },
      ];
      let filtered = filters.filterHttp(pages);

      let urls = filtered.map(x => x.url);
      expect(urls).to.deep.equal([
        'https://i-beam.org/bar', 'http://i-beam.net/hoge', 'http://i-beam.net/fuga'
      ]);
    })
  });

  describe('filterBlankTitle', () => {
    it('filters blank titles', () => {
      let pages = [
        { title: 'hello' },
        { title: '' },
        {},
      ];
      let filtered = filters.filterBlankTitle(pages);

      expect(filtered).to.deep.equal([{ title: 'hello' }]);
    });
  })

  describe('filterByTailingSlash', () => {
    it('filters duplicated pathname on tailing slash', () => {
      let pages = [
        { url: 'http://i-beam.org/content' },
        { url: 'http://i-beam.org/content/' },
        { url: 'http://i-beam.org/search' },
        { url: 'http://i-beam.org/search?q=apple_banana_cherry' },
      ];
      let filtered = filters.filterByTailingSlash(pages);

      let urls = filtered.map(x => x.url);
      expect(urls).to.deep.equal([
        'http://i-beam.org/content',
        'http://i-beam.org/search',
        'http://i-beam.org/search?q=apple_banana_cherry',
      ]);
    });
  })

  describe('filterByPathname', () => {
    it('remains items less than minimam length', () => {
      let pages = [
        { url: 'http://i-beam.org/search?q=apple' },
        { url: 'http://i-beam.org/search?q=apple_banana' },
        { url: 'http://i-beam.org/search?q=apple_banana_cherry' },
        { url: 'http://i-beam.org/request?q=apple' },
        { url: 'http://i-beam.org/request?q=apple_banana' },
        { url: 'http://i-beam.org/request?q=apple_banana_cherry' },
      ];
      let filtered = filters.filterByPathname(pages, 10);
      expect(filtered).to.have.lengthOf(6);
    });

    it('filters by length of pathname', () => {
      let pages = [
        { url: 'http://i-beam.org/search?q=apple' },
        { url: 'http://i-beam.org/search?q=apple_banana' },
        { url: 'http://i-beam.org/search?q=apple_banana_cherry' },
        { url: 'http://i-beam.net/search?q=apple' },
        { url: 'http://i-beam.net/search?q=apple_banana' },
        { url: 'http://i-beam.net/search?q=apple_banana_cherry' },
      ];
      let filtered = filters.filterByPathname(pages, 0);
      expect(filtered).to.deep.equal([
        { url: 'http://i-beam.org/search?q=apple' },
        { url: 'http://i-beam.net/search?q=apple' },
      ]);
    });
  })

  describe('filterByOrigin', () => {
    it('remains items less than minimam length', () => {
      let pages = [
        { url: 'http://i-beam.org/search?q=apple' },
        { url: 'http://i-beam.org/search?q=apple_banana' },
        { url: 'http://i-beam.org/search?q=apple_banana_cherry' },
        { url: 'http://i-beam.org/request?q=apple' },
        { url: 'http://i-beam.org/request?q=apple_banana' },
        { url: 'http://i-beam.org/request?q=apple_banana_cherry' },
      ];
      let filtered = filters.filterByOrigin(pages, 10);
      expect(filtered).to.have.lengthOf(6);
    });

    it('filters by length of pathname', () => {
      let pages = [
        { url: 'http://i-beam.org/search?q=apple' },
        { url: 'http://i-beam.org/search?q=apple_banana' },
        { url: 'http://i-beam.org/search?q=apple_banana_cherry' },
        { url: 'http://i-beam.org/request?q=apple' },
        { url: 'http://i-beam.org/request?q=apple_banana' },
        { url: 'http://i-beam.org/request?q=apple_banana_cherry' },
      ];
      let filtered = filters.filterByOrigin(pages, 0);
      expect(filtered).to.deep.equal([
        { url: 'http://i-beam.org/search?q=apple' },
      ]);
    });
  })
});
