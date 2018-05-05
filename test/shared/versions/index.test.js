import * as versions from 'shared/versions';
import manifest from '../../../manifest.json';

describe("shared/versions/storage", () => {
  describe('#checkUpdated', () => {
    beforeEach(() => {
      return browser.storage.local.remove('version');
    });

    it('return true if no previous versions', () => {
      return Promise.resolve().then(() => {
        return versions.checkUpdated();
      }).then((updated) => {
        expect(updated).to.be.true;
      });
    });

    it('return true if updated', () => {
      return Promise.resolve().then(() => {
        return browser.storage.local.set({ version: '0.001' });
      }).then(() => {
        return versions.checkUpdated();
      }).then((updated) => {
        expect(updated).to.be.true;
      });
    });

    it('return false if not updated', () => {
      return Promise.resolve().then(() => {
        return browser.storage.local.set({ version: manifest.version });
      }).then(() => {
        return versions.checkUpdated();
      }).then((updated) => {
        expect(updated).to.be.false;
      });
    });
  });

  describe('#commit', () => {
    beforeEach(() => {
      return browser.storage.local.remove('version');
    });

    it('saves current version from manifest.json', () => {
      return Promise.resolve().then(() => {
        return versions.commit();
      }).then(() => {
        return browser.storage.local.get('version');
      }).then(({version}) => {
        expect(version).to.be.a('string');
        expect(version).to.equal(manifest.version);
      });
    });
  });
});
