import { injectable } from "tsyringe";
import * as urls from "../../shared/urls";

@injectable()
export default class BrowserSettingRepository {
  async getHomepageUrls(): Promise<string[]> {
    const { value } = await browser.browserSettings.homepageOverride.get({});
    return value.split("|").map(urls.normalizeUrl);
  }
}
