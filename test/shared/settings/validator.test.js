import { expect } from "chai";
import { validate } from 'shared/settings/validator';

describe("setting validator", () => {
  describe("unknown top keys", () => {
    it('throws an error for unknown settings', () => {
      let settings = { keymaps: {}, poison: 123 };
      let fn = validate.bind(undefined, settings)
      expect(fn).to.throw(Error, 'poison');
    })
  });

  describe("keymaps settings", () => {
    it('throws an error for unknown operation', () => {
      let settings = {
        keymaps: {
          a: { 'type': 'scroll.home' },
          b: { 'type': 'poison.dressing' },
        }
      };
      let fn = validate.bind(undefined, settings)
      expect(fn).to.throw(Error, 'poison.dressing');
    });
  });

  describe("search settings", () => {
    it('throws an error for invalid search engine name', () => {
      let settings = {
        search: {
          default: 'google',
          engines: {
            'google': 'https://google.com/search?q={}',
            'cherry pie': 'https://cherypie.com/search?q={}',
          }
        }
      };
      let fn = validate.bind(undefined, settings)
      expect(fn).to.throw(Error, 'cherry pie');
    });

    it('throws an error for no {}-placeholder', () => {
      let settings = {
        search: {
          default: 'google',
          engines: {
            'google': 'https://google.com/search?q={}',
            'yahoo': 'https://search.yahoo.com/search',
          }
        }
      };
      let fn = validate.bind(undefined, settings)
      expect(fn).to.throw(Error, 'yahoo');
    });

    it('throws an error for no default engines', () => {
      let settings = {
        search: {
          engines: {
            'google': 'https://google.com/search?q={}',
            'yahoo': 'https://search.yahoo.com/search?q={}',
          }
        }
      };
      let fn = validate.bind(undefined, settings)
      expect(fn).to.throw(Error, 'Default engine');
    });

    it('throws an error for invalid default engine', () => {
      let settings = {
        search: {
          default: 'twitter',
          engines: {
            'google': 'https://google.com/search?q={}',
            'yahoo': 'https://search.yahoo.com/search?q={}',
          }
        }
      };
      let fn = validate.bind(undefined, settings)
      expect(fn).to.throw(Error, 'twitter');
    });
  });
});
