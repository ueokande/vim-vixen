import { injectable } from "tsyringe";
import * as urls from "../../shared/urls";

export default interface BrowserSettingRepository {
  getHomepageUrls(): Promise<string[]>;
}

@injectable()
export class BrowserSettingRepositoryImpl implements BrowserSettingRepository {
  async getHomepageUrls(): Promise<string[]> {
    const { value } = await browser.browserSettings.homepageOverride.get({});
    return value.split("|").map(urls.normalizeUrl);
  }
}
