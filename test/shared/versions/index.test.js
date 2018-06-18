import * as versions from 'shared/versions';
import manifest from '../../../manifest.json';

describe("shared/versions/storage", () => {
  describe('#checkUpdated', () => {
    beforeEach(() => {
      return browser.storage.local.remove('version');
    });

    it('return true if no previous versions', async() => {
      let updated = await versions.checkUpdated();
      expect(updated).to.be.true;
    });

    it('return true if updated', async() => {
      await browser.storage.local.set({ version: '0.001' });
      let updated = await versions.checkUpdated();
      expect(updated).to.be.true;
    });

    it('return false if not updated', async() => {
      await browser.storage.local.set({ version: manifest.version });
      let updated = await versions.checkUpdated();
      expect(updated).to.be.false;
    });
  });

  describe('#commit', () => {
    beforeEach(() => {
      return browser.storage.local.remove('version');
    });

    it('saves current version from manifest.json', async() => {
      await versions.commit();
      let { version } = await browser.storage.local.get('version');
      expect(version).to.be.a('string');
      expect(version).to.equal(manifest.version);
    });
  });
});
