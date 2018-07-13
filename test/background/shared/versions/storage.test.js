import * as storage from 'background/shared/versions/storage';

describe("shared/versions/storage", () => {
  describe('#load', () => {
    beforeEach(() => {
      return browser.storage.local.remove('version');
    });

    it('loads saved version', async() => {
      await browser.storage.local.set({ version: '1.2.3' });
      let version = await storage.load();
      expect(version).to.equal('1.2.3');
    });

    it('returns undefined if no versions in storage', async() => {
      let version = await storage.load();
      expect(version).to.be.a('undefined');
    });
  });

  describe('#save', () => {
    it('saves version string', async() => {
      await storage.save('2.3.4');
      let { version } = await browser.storage.local.get('version');
      expect(version).to.equal('2.3.4');
    });
  });
});
