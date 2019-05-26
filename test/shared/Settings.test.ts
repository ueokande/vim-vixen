import * as settings from '../../src/shared/Settings';
import { expect } from 'chai';

describe('Settings', () => {
  describe('#keymapsValueOf', () => {
    it('returns empty object by empty settings', () => {
      let keymaps = settings.keymapsValueOf({});
      expect(keymaps).to.be.empty;
    });

    it('returns keymaps by valid settings', () => {
      let keymaps = settings.keymapsValueOf({
        k: { type: "scroll.vertically", count: -1 },
        j: { type: "scroll.vertically", count: 1 },
      });

      expect(keymaps['k']).to.deep.equal({ type: "scroll.vertically", count: -1 });
      expect(keymaps['j']).to.deep.equal({ type: "scroll.vertically", count: 1 });
    });

    it('throws a TypeError by invalid settings', () => {
      expect(() => settings.keymapsValueOf(null)).to.throw(TypeError);
      expect(() => settings.keymapsValueOf({
        k: { type: "invalid.operation" },
      })).to.throw(TypeError);
    });
  });

  describe('#searchValueOf', () => {
    it('returns search settings by valid settings', () => {
      let search = settings.searchValueOf({
        default: "google",
        engines: {
          "google": "https://google.com/search?q={}",
          "yahoo": "https://search.yahoo.com/search?p={}",
        }
      });

      expect(search).to.deep.equal({
        default: "google",
        engines: {
          "google": "https://google.com/search?q={}",
          "yahoo": "https://search.yahoo.com/search?p={}",
        }
      });
    });

    it('throws a TypeError by invalid settings', () => {
      expect(() => settings.searchValueOf(null)).to.throw(TypeError);
      expect(() => settings.searchValueOf({})).to.throw(TypeError);
      expect(() => settings.searchValueOf([])).to.throw(TypeError);
      expect(() => settings.searchValueOf({
        default: 123,
        engines: {}
      })).to.throw(TypeError);
      expect(() => settings.searchValueOf({
        default: "google",
        engines: {
          "google": 123456,
        }
      })).to.throw(TypeError);
      expect(() => settings.searchValueOf({
        default: "wikipedia",
        engines: {
          "google": "https://google.com/search?q={}",
          "yahoo": "https://search.yahoo.com/search?p={}",
        }
      })).to.throw(TypeError);
      expect(() => settings.searchValueOf({
        default: "g o o g l e",
        engines: {
          "g o o g l e": "https://google.com/search?q={}",
        }
      })).to.throw(TypeError);
      expect(() => settings.searchValueOf({
        default: "google",
        engines: {
          "google": "https://google.com/search",
        }
      })).to.throw(TypeError);
      expect(() => settings.searchValueOf({
        default: "google",
        engines: {
          "google": "https://google.com/search?q={}&r={}",
        }
      })).to.throw(TypeError);
    });
  });

  describe('#propertiesValueOf', () => {
    it('returns with default properties by empty settings', () => {
      let props = settings.propertiesValueOf({});
      expect(props).to.deep.equal({
        hintchars: "abcdefghijklmnopqrstuvwxyz",
        smoothscroll: false,
        complete: "sbh"
      })
    });

    it('returns properties by valid settings', () => {
      let props = settings.propertiesValueOf({
        hintchars: "abcdefgh",
        smoothscroll: false,
        complete: "sbh"
      });

      expect(props).to.deep.equal({
        hintchars: "abcdefgh",
        smoothscroll: false,
        complete: "sbh"
      });
    });

    it('throws a TypeError by invalid settings', () => {
      expect(() => settings.keymapsValueOf(null)).to.throw(TypeError);
      expect(() => settings.keymapsValueOf({
        smoothscroll: 'false',
      })).to.throw(TypeError);
      expect(() => settings.keymapsValueOf({
        unknown: 'xyz'
      })).to.throw(TypeError);
    });
  });

  describe('#blacklistValueOf', () => {
    it('returns empty array by empty settings', () => {
      let blacklist = settings.blacklistValueOf([]);
      expect(blacklist).to.be.empty;
    });

    it('returns blacklist by valid settings', () => {
      let blacklist = settings.blacklistValueOf([
        "github.com",
        "circleci.com",
      ]);

      expect(blacklist).to.deep.equal([
        "github.com",
        "circleci.com",
      ]);
    });

    it('throws a TypeError by invalid settings', () => {
      expect(() => settings.blacklistValueOf(null)).to.throw(TypeError);
      expect(() => settings.blacklistValueOf({})).to.throw(TypeError);
      expect(() => settings.blacklistValueOf([1,2,3])).to.throw(TypeError);
    });
  });

  describe('#valueOf', () => {
    it('returns settings by valid settings', () => {
      let x = settings.valueOf({
        keymaps: {},
        "search": {
          "default": "google",
          "engines": {
            "google": "https://google.com/search?q={}",
          }
        },
        "properties": {},
        "blacklist": []
      });

      expect(x).to.deep.equal({
        keymaps: {},
        search: {
          default: "google",
          engines: {
            google: "https://google.com/search?q={}",
          }
        },
        properties: {
          hintchars: "abcdefghijklmnopqrstuvwxyz",
          smoothscroll: false,
          complete: "sbh"
        },
        blacklist: []
      });
    });

    it('sets default settings', () => {
      let value = settings.valueOf({});
      expect(value.keymaps).to.not.be.empty;
      expect(value.properties).to.not.be.empty;
      expect(value.search.default).to.be.a('string');
      expect(value.search.engines).to.be.an('object');
      expect(value.blacklist).to.be.empty;
    });

    it('throws a TypeError with an unknown field', () => {
      expect(() => settings.valueOf({ name: 'alice' })).to.throw(TypeError)
    });
  });
});
