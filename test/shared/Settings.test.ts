import * as settings from '../../src/shared/Settings';
import { expect } from 'chai';

describe('Settings', () => {

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

      expect({
        keymaps: x.keymaps.toJSON(),
        search: x.search.toJSON(),
        properties: x.properties,
        blacklist: x.blacklist,
      }).to.deep.equal({
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
      expect(value.keymaps.toJSON()).to.not.be.empty;
      expect(value.properties).to.not.be.empty;
      expect(value.search.defaultEngine).to.be.a('string');
      expect(value.search.engines).to.be.an('object');
      expect(value.blacklist).to.be.empty;
    });

    it('throws a TypeError with an unknown field', () => {
      expect(() => settings.valueOf({ name: 'alice' })).to.throw(TypeError)
    });
  });
});
