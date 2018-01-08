import { expect } from "chai";
import { parseProperty } from 'shared/commands/properties';

describe("shared/commands/properties", () => {
  describe("#parseProperty", () => {
    it('parse set string', () => {
      let [key, value] = parseProperty('encoding=utf-8', { encoding: 'string' });
      expect(key).to.equal('encoding');
      expect(value).to.equal('utf-8');
    });

    it('parse set string', () => {
      let [key, value] = parseProperty('history=50', { history: 'number' });
      expect(key).to.equal('history');
      expect(value).to.equal(50);
    });

    it('parse set boolean', () => {
      let [key, value] = parseProperty('paste', { paste: 'boolean' });
      expect(key).to.equal('paste');
      expect(value).to.be.true;

      [key, value] = parseProperty('nopaste', { paste: 'boolean' });
      expect(key).to.equal('paste');
      expect(value).to.be.false;
    });

    it('throws error on unknown property', () => {
      expect(() => parseProperty('charset=utf-8', {})).to.throw(Error, 'Unknown');
      expect(() => parseProperty('smoothscroll', {})).to.throw(Error, 'Unknown');
      expect(() => parseProperty('nosmoothscroll', {})).to.throw(Error, 'Unknown');
    })

    it('throws error on invalid property', () => {
      expect(() => parseProperty('charset=utf-8', { charset: 'number' })).to.throw(Error, 'Not number');
      expect(() => parseProperty('charset=utf-8', { charset: 'boolean' })).to.throw(Error, 'Invalid');
      expect(() => parseProperty('smoothscroll', { smoothscroll: 'string' })).to.throw(Error, 'Invalid');
      expect(() => parseProperty('smoothscroll', { smoothscroll: 'number' })).to.throw(Error, 'Invalid');
    })
  });
});
