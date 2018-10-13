import MemoryStorage from 'background/infrastructures/memory-storage';

describe("background/infrastructures/memory-storage", () => {
  it('stores values', () => {
    let cache = new MemoryStorage();
    cache.set('number', 123);
    expect(cache.get('number')).to.equal(123);

    cache.set('string', '123');
    expect(cache.get('string')).to.equal('123');

    cache.set('object', { hello: '123' });
    expect(cache.get('object')).to.deep.equal({ hello: '123' });
  });

  it('returns undefined if no keys', () => {
    let cache = new MemoryStorage();
    expect(cache.get('no-keys')).to.be.undefined;
  })

  it('stored on shared memory', () => {
    let cache = new MemoryStorage();
    cache.set('red', 'apple');

    cache = new MemoryStorage();
    let got = cache.get('red');
    expect(got).to.equal('apple');
  });

  it('stored cloned objects', () => {
    let cache = new MemoryStorage();
    let recipe = { sugar: '300g' };
    cache.set('recipe', recipe);

    recipe.salt = '20g'
    let got = cache.get('recipe', recipe);
    expect(got).to.deep.equal({ sugar: '300g' });
  });

  it('throws an error with unserializable objects', () => {
    let cache = new MemoryStorage();
    expect(() => cache.set('fn', setTimeout)).to.throw();
  })
});
