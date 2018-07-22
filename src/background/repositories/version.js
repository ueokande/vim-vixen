export default class VersionRepository {
  async get() {
    let { version } = await browser.storage.local.get('version');
    return version;
  }

  update(version) {
    return browser.storage.local.set({ version });
  }
}
