import { SettingRepositoryImpl } from "../../../src/content/repositories/SettingRepository";
import Settings from "../../../src/shared/settings/Settings";

describe("SettingRepositoryImpl", () => {
  it("updates and gets current value", () => {
    const sut = new SettingRepositoryImpl();

    const settings = Settings.fromJSON({
      keymaps: {},
      search: {
        default: "google",
        engines: {
          google: "https://google.com/?q={}",
        },
      },
      properties: {
        hintchars: "abcd1234",
        smoothscroll: false,
        complete: "sbh",
      },
      blacklist: [],
    });

    sut.set(settings);

    const actual = sut.get();
    expect(actual.properties.hintchars).toEqual("abcd1234");
  });
});
