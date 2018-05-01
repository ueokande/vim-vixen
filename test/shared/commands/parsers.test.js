import { expect } from "chai";
import * as parsers from 'shared/commands/parsers';

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

  describe('#normalizeUrl', () => {
    const config = {
      default: 'google',
      engines: {
        google: 'https://google.com/search?q={}',
        yahoo: 'https://yahoo.com/search?q={}',
      }
    };

    it('convertes search url', () => {
      expect(parsers.normalizeUrl(['google', 'apple'], config))
        .to.equal('https://google.com/search?q=apple');
      expect(parsers.normalizeUrl(['yahoo', 'apple'], config))
        .to.equal('https://yahoo.com/search?q=apple');
      expect(parsers.normalizeUrl(['google', 'apple', 'banana'], config))
        .to.equal('https://google.com/search?q=apple%20banana');
      expect(parsers.normalizeUrl(['yahoo', 'C++CLI'], config))
        .to.equal('https://yahoo.com/search?q=C%2B%2BCLI');
    });

    it('user default  search engine', () => {
      expect(parsers.normalizeUrl(['apple', 'banana'], config))
        .to.equal('https://google.com/search?q=apple%20banana');
    });
  });

  describe('#parseCommandLine', () => {
    it('parse command line as name and args', () => {
      expect(parsers.parseCommandLine('open google apple')).to.deep.equal(['open', ['google', 'apple']]);
      expect(parsers.parseCommandLine('  open  google  apple  ')).to.deep.equal(['open', ['google', 'apple']]);
      expect(parsers.parseCommandLine('')).to.deep.equal(['', []]);
      expect(parsers.parseCommandLine('  ')).to.deep.equal(['', []]);
      expect(parsers.parseCommandLine('exit')).to.deep.equal(['exit', []]);
      expect(parsers.parseCommandLine('  exit  ')).to.deep.equal(['exit', []]);
    });
  });
});
