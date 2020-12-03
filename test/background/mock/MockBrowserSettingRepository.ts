import BrowserSettingRepository from "../../../src/background/repositories/BrowserSettingRepository";

export default class MockBrowserSettingRepository
  implements BrowserSettingRepository {
  constructor(private readonly homepageUrls: string[]) {}

  getHomepageUrls(): Promise<string[]> {
    return Promise.resolve(this.homepageUrls);
  }
}
