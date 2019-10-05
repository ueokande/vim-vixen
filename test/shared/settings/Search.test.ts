import Search from '../../../src/shared/settings/Search';
import { expect } from 'chai';

describe('Search', () => {
  it('returns search settings by valid settings', () => {
    let search = Search.fromJSON({
      default: 'google',
      engines: {
        'google': 'https://google.com/search?q={}',
        'yahoo': 'https://search.yahoo.com/search?p={}',
      }
    });

    expect(search.defaultEngine).to.equal('google')
    expect(search.engines).to.deep.equals({
      'google': 'https://google.com/search?q={}',
      'yahoo': 'https://search.yahoo.com/search?p={}',
    });
    expect(search.toJSON()).to.deep.equal({
      default: 'google',
      engines: {
        'google': 'https://google.com/search?q={}',
        'yahoo': 'https://search.yahoo.com/search?p={}',
      }
    });
  });

  it('throws a TypeError by invalid settings', () => {
    expect(() => Search.fromJSON(null)).to.throw(TypeError);
    expect(() => Search.fromJSON({})).to.throw(TypeError);
    expect(() => Search.fromJSON([])).to.throw(TypeError);
    expect(() => Search.fromJSON({
      default: 123,
      engines: {}
    })).to.throw(TypeError);
    expect(() => Search.fromJSON({
      default: 'google',
      engines: {
        'google': 123456,
      }
    })).to.throw(TypeError);
    expect(() => Search.fromJSON({
      default: 'wikipedia',
      engines: {
        'google': 'https://google.com/search?q={}',
        'yahoo': 'https://search.yahoo.com/search?p={}',
      }
    })).to.throw(TypeError);
    expect(() => Search.fromJSON({
      default: 'g o o g l e',
      engines: {
        'g o o g l e': 'https://google.com/search?q={}',
      }
    })).to.throw(TypeError);
    expect(() => Search.fromJSON({
      default: 'google',
      engines: {
        'google': 'https://google.com/search',
      }
    })).to.throw(TypeError);
    expect(() => Search.fromJSON({
      default: 'google',
      engines: {
        'google': 'https://google.com/search?q={}&r={}',
      }
    })).to.throw(TypeError);
  });
});
