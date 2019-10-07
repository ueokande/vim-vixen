import Blacklist from '../../../src/shared/settings/Blacklist';
import { expect } from 'chai';

describe('Blacklist', () => {
  describe('fromJSON', () => {
    it('returns empty array by empty settings', () => {
      let blacklist = Blacklist.fromJSON([]);
      expect(blacklist.toJSON()).to.be.empty;
    });

    it('returns blacklist by valid settings', () => {
      let blacklist = Blacklist.fromJSON([
        'github.com',
        'circleci.com',
      ]);

      expect(blacklist.toJSON()).to.deep.equal([
        'github.com',
        'circleci.com',
      ]);
    });

    it('throws a TypeError by invalid settings', () => {
      expect(() => Blacklist.fromJSON(null)).to.throw(TypeError);
      expect(() => Blacklist.fromJSON({})).to.throw(TypeError);
      expect(() => Blacklist.fromJSON([1,2,3])).to.throw(TypeError);
    });
  });

  describe('#includes', () => {
    it('matches by *', () => {
      let blacklist = new Blacklist(['*']);

      expect(blacklist.includes('https://github.com/abc')).to.be.true;
    });

    it('matches by hostname', () => {
      let blacklist = new Blacklist(['github.com']);

      expect(blacklist.includes('https://github.com')).to.be.true;
      expect(blacklist.includes('https://gist.github.com')).to.be.false;
      expect(blacklist.includes('https://github.com/ueokande')).to.be.true;
      expect(blacklist.includes('https://github.org')).to.be.false;
      expect(blacklist.includes('https://google.com/search?q=github.org')).to.be.false;
    });

    it('matches by hostname with wildcard', () => {
      let blacklist = new Blacklist(['*.github.com']);

      expect(blacklist.includes('https://github.com')).to.be.false;
      expect(blacklist.includes('https://gist.github.com')).to.be.true;
    })

    it('matches by path', () => {
      let blacklist = new Blacklist(['github.com/abc']);

      expect(blacklist.includes('https://github.com/abc')).to.be.true;
      expect(blacklist.includes('https://github.com/abcdef')).to.be.false;
      expect(blacklist.includes('https://gist.github.com/abc')).to.be.false;
    })

    it('matches by path with wildcard', () => {
      let blacklist = new Blacklist(['github.com/abc*']);

      expect(blacklist.includes('https://github.com/abc')).to.be.true;
      expect(blacklist.includes('https://github.com/abcdef')).to.be.true;
      expect(blacklist.includes('https://gist.github.com/abc')).to.be.false;
    })

    it('matches address and port', () => {
      let blacklist = new Blacklist(['127.0.0.1:8888']);

      expect(blacklist.includes('http://127.0.0.1:8888/')).to.be.true;
      expect(blacklist.includes('http://127.0.0.1:8888/hello')).to.be.true;
    })
  })
});
