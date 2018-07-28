import * as parsers from 'background/usecases/parsers';

describe("shared/commands/parsers", () => {
  describe("#parsers.parseSetOption", () => {
    it('parse set string', () => {
      let [key, value] = parsers.parseSetOption('encoding=utf-8', { encoding: 'string' });
      expect(key).to.equal('encoding');
      expect(value).to.equal('utf-8');
    });

    it('parse set empty string', () => {
      let [key, value] = parsers.parseSetOption('encoding=', { encoding: 'string' });
      expect(key).to.equal('encoding');
      expect(value).to.equal('');
    });

    it('parse set string', () => {
      let [key, value] = parsers.parseSetOption('history=50', { history: 'number' });
      expect(key).to.equal('history');
      expect(value).to.equal(50);
    });

    it('parse set boolean', () => {
      let [key, value] = parsers.parseSetOption('paste', { paste: 'boolean' });
      expect(key).to.equal('paste');
      expect(value).to.be.true;

      [key, value] = parsers.parseSetOption('nopaste', { paste: 'boolean' });
      expect(key).to.equal('paste');
      expect(value).to.be.false;
    });

    it('throws error on unknown property', () => {
      expect(() => parsers.parseSetOption('charset=utf-8', {})).to.throw(Error, 'Unknown');
      expect(() => parsers.parseSetOption('smoothscroll', {})).to.throw(Error, 'Unknown');
      expect(() => parsers.parseSetOption('nosmoothscroll', {})).to.throw(Error, 'Unknown');
    })

    it('throws error on invalid property', () => {
      expect(() => parsers.parseSetOption('charset=utf-8', { charset: 'number' })).to.throw(Error, 'Not number');
      expect(() => parsers.parseSetOption('charset=utf-8', { charset: 'boolean' })).to.throw(Error, 'Invalid');
      expect(() => parsers.parseSetOption('charset=', { charset: 'boolean' })).to.throw(Error, 'Invalid');
      expect(() => parsers.parseSetOption('smoothscroll', { smoothscroll: 'string' })).to.throw(Error, 'Invalid');
      expect(() => parsers.parseSetOption('smoothscroll', { smoothscroll: 'number' })).to.throw(Error, 'Invalid');
    })
  });
});
