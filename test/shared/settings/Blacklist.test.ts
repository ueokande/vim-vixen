import Blacklist, { BlacklistItem } from '../../../src/shared/settings/Blacklist';
import { expect } from 'chai';

describe('BlacklistItem', () => {
  describe('#fromJSON', () => {
    it('parses string pattern', () => {
      let item = BlacklistItem.fromJSON('example.com');
      expect(item.pattern).to.equal('example.com');
      expect(item.partial).to.be.false;
    });

    it('parses partial blacklist item', () => {
      let item = BlacklistItem.fromJSON({ url: 'example.com', keys: ['j', 'k']});
      expect(item.pattern).to.equal('example.com');
      expect(item.partial).to.be.true;
      expect(item.keys).to.deep.equal(['j', 'k']);
    });

    it('throws a TypeError', () => {
      expect(() => BlacklistItem.fromJSON(null)).to.throw(TypeError);
      expect(() => BlacklistItem.fromJSON(100)).to.throw(TypeError);
      expect(() => BlacklistItem.fromJSON({})).to.throw(TypeError);
      expect(() => BlacklistItem.fromJSON({url: 'google.com'})).to.throw(TypeError);
      expect(() => BlacklistItem.fromJSON({keys: ['a']})).to.throw(TypeError);
      expect(() => BlacklistItem.fromJSON({url: 'google.com', keys: 10})).to.throw(TypeError);
      expect(() => BlacklistItem.fromJSON({url: 'google.com', keys: ['a', 'b', 3]})).to.throw(TypeError);
    });
  });

  describe('#matches', () => {
    it('matches by "*"', () => {
      let item = BlacklistItem.fromJSON('*');
      expect(item.matches(new URL('https://github.com/abc'))).to.be.true;
    });

    it('matches by hostname', () => {
      let item = BlacklistItem.fromJSON('github.com');
      expect(item.matches(new URL('https://github.com'))).to.be.true;
      expect(item.matches(new URL('https://gist.github.com'))).to.be.false;
      expect(item.matches(new URL('https://github.com/ueokande'))).to.be.true;
      expect(item.matches(new URL('https://github.org'))).to.be.false;
      expect(item.matches(new URL('https://google.com/search?q=github.org'))).to.be.false;
    });

    it('matches by hostname with wildcard', () => {
      let item = BlacklistItem.fromJSON('*.github.com');

      expect(item.matches(new URL('https://github.com'))).to.be.false;
      expect(item.matches(new URL('https://gist.github.com'))).to.be.true;
    });

    it('matches by path', () => {
      let item = BlacklistItem.fromJSON('github.com/abc');

      expect(item.matches(new URL('https://github.com/abc'))).to.be.true;
      expect(item.matches(new URL('https://github.com/abcdef'))).to.be.false;
      expect(item.matches(new URL('https://gist.github.com/abc'))).to.be.false;
    });

    it('matches by path with wildcard', () => {
      let item = BlacklistItem.fromJSON('github.com/abc*');

      expect(item.matches(new URL('https://github.com/abc'))).to.be.true;
      expect(item.matches(new URL('https://github.com/abcdef'))).to.be.true;
      expect(item.matches(new URL('https://gist.github.com/abc'))).to.be.false;
    });

    it('matches address and port', () => {
      let item = BlacklistItem.fromJSON('127.0.0.1:8888');

      expect(item.matches(new URL('http://127.0.0.1:8888/'))).to.be.true;
      expect(item.matches(new URL('http://127.0.0.1:8888/hello'))).to.be.true;
    });

    it('matches with partial blacklist', () => {
      let item = BlacklistItem.fromJSON({ url: 'google.com', keys: ['j', 'k'] });

      expect(item.matches(new URL('https://google.com'))).to.be.true;
      expect(item.matches(new URL('https://yahoo.com'))).to.be.false;
    })
  });

  describe('#includesPartialKeys', () => {
    it('matches with partial keys', () => {
      let item = BlacklistItem.fromJSON({url: 'google.com', keys: ['j', 'k']});

      expect(item.includeKey(new URL('http://google.com/maps'), 'j')).to.be.true;
      expect(item.includeKey(new URL('http://google.com/maps'), 'z')).to.be.false;
      expect(item.includeKey(new URL('http://maps.google.com/'), 'j')).to.be.false;
    })
  });
});

describe('Blacklist', () => {
  describe('#fromJSON', () => {
    it('parses string list', () => {
      let blacklist = Blacklist.fromJSON(['example.com', 'example.org']);
      expect(blacklist.toJSON()).to.deep.equals([
        'example.com', 'example.org',
      ]);
    });

    it('parses mixed blacklist', () => {
      let blacklist = Blacklist.fromJSON([
        { url: 'example.com', keys: ['j', 'k']},
        'example.org',
      ]);
      expect(blacklist.toJSON()).to.deep.equals([
        { url: 'example.com', keys: ['j', 'k']},
        'example.org',
      ]);
    });

    it('parses empty blacklist', () => {
      let blacklist = Blacklist.fromJSON([]);
      expect(blacklist.toJSON()).to.deep.equals([]);
    });

    it('throws a TypeError', () => {
      expect(() => Blacklist.fromJSON(null)).to.throw(TypeError);
      expect(() => Blacklist.fromJSON(100)).to.throw(TypeError);
      expect(() => Blacklist.fromJSON({})).to.throw(TypeError);
      expect(() => Blacklist.fromJSON([100])).to.throw(TypeError);
      expect(() => Blacklist.fromJSON([{}])).to.throw(TypeError);
    })
  });

  describe('#includesEntireBlacklist', () => {
    it('matches a url with entire blacklist', () => {
      let blacklist = Blacklist.fromJSON(['google.com', '*.github.com']);
      expect(blacklist.includesEntireBlacklist(new URL('https://google.com'))).to.be.true;
      expect(blacklist.includesEntireBlacklist(new URL('https://github.com'))).to.be.false;
      expect(blacklist.includesEntireBlacklist(new URL('https://gist.github.com'))).to.be.true;
    });

    it('does not matches with partial blacklist', () => {
      let blacklist = Blacklist.fromJSON(['google.com', { url: 'yahoo.com', keys: ['j', 'k'] }]);
      expect(blacklist.includesEntireBlacklist(new URL('https://google.com'))).to.be.true;
      expect(blacklist.includesEntireBlacklist(new URL('https://yahoo.com'))).to.be.false;
    });
  });

  describe('#includesKeys', () => {
    it('matches with entire blacklist or keys in the partial blacklist', () => {
      let blacklist = Blacklist.fromJSON([
        'google.com',
        { url: 'github.com', keys: ['j', 'k'] },
      ]);

      expect(blacklist.includeKey(new URL('https://google.com'), 'j')).to.be.true;
      expect(blacklist.includeKey(new URL('https://github.com'), 'j')).to.be.true;
      expect(blacklist.includeKey(new URL('https://github.com'), 'a')).to.be.false;
    });
  });
});
