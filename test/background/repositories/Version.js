import VersionRepository from 'background/repositories/Version';

describe("background/repositories/version", () => {
  let versionRepository;

  beforeEach(() => {
    versionRepository = new VersionRepository;
  });

  describe('#get', () => {
    beforeEach(() => {
      return browser.storage.local.remove('version');
    });

    it('loads saved version', async() => {
      await browser.storage.local.set({ version: '1.2.3' });
      let version = await this.versionRepository.get();
      expect(version).to.equal('1.2.3');
    });

    it('returns undefined if no versions in storage', async() => {
      let version = await storage.load();
      expect(version).to.be.a('undefined');
    });
  });

  describe('#update', () => {
    it('saves version string', async() => {
      await versionRepository.update('2.3.4');
      let { version } = await browser.storage.local.get('version');
      expect(version).to.equal('2.3.4');
    });
  });
});
