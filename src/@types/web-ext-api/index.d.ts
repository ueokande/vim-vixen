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

  function get(param: { [key: string]: string }): Promise<BrowserSettings>;
}
