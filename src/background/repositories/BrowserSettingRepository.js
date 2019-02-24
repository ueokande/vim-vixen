import * as urls from '../../shared/urls';

export default class BrowserSettingRepository {
  async getHomepageUrls() {
    let { value } = await browser.browserSettings.homepageOverride.get({});
    return value.split('|').map(urls.normalizeUrl);
  }
}
