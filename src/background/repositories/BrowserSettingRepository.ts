import { injectable } from "tsyringe";
import * as urls from "../../shared/urls";

declare namespace browser.browserSettings.homepageOverride {
  type BrowserSettings = {
    value: string;
    levelOfControl: LevelOfControlType;
  };

  type LevelOfControlType =
    | "not_controllable"
    | "controlled_by_other_extensions"
    | "controllable_by_this_extension"
    | "controlled_by_this_extension";

  function get(param: object): Promise<BrowserSettings>;
}

@injectable()
export default class BrowserSettingRepository {
  async getHomepageUrls(): Promise<string[]> {
    const { value } = await browser.browserSettings.homepageOverride.get({});
    return value.split("|").map(urls.normalizeUrl);
  }
}
