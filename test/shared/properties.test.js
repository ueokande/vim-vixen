import * as settings from 'shared/settings';

describe('properties', () => {
  describe('Def class', () => {
    it('returns property definitions', () => {
      let def = new proerties.Def(
        'smoothscroll',
        'smooth scroll',
        false);

      expect(def.name).to.equal('smoothscroll');
      expect(def.describe).to.equal('smooth scroll');
      expect(def.defaultValue).to.equal(false);
      expect(def.type).to.equal('boolean');
    });
  });
});

