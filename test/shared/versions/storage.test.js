import * as storage from 'shared/versions/storage';

describe("shared/versions/storage", () => {
  describe('#load', () => {
    beforeEach(() => {
      return browser.storage.local.remove('version');
    });

    it('loads saved version', () => {
      return Promise.resolve().then(() => {
        return browser.storage.local.set({ version: '1.2.3' });
      }).then(() => {
        return storage.load();
      }).then((version) => {
        expect(version).to.equal('1.2.3');
      });
    });

    it('returns undefined if no versions in storage', () => {
      return Promise.resolve().then(() => {
        return storage.load();
      }).then((version) => {
        expect(version).to.be.a('undefined');
      });
    });
  });

  describe('#save', () => {
    it('saves version string', () => {
      return Promise.resolve().then(() => {
        return storage.save('2.3.4');
      }).then(() => {
        return browser.storage.local.get('version');
      }).then(({version}) => {
        expect(version).to.equal('2.3.4');
      });
    });
  });
});
