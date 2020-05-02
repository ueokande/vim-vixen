import * as path from "path";
import * as assert from "assert";

import { Builder, Lanthan } from "lanthan";
import OptionPage from "./lib/OptionPage";

describe("options form page", () => {
  let lanthan: Lanthan;
  let browser: any;

  beforeEach(async () => {
    lanthan = await Builder.forBrowser("firefox")
      .spyAddon(path.join(__dirname, ".."))
      .build();
    browser = lanthan.getWebExtBrowser();

    const tabs = await browser.tabs.query({});
    for (const tab of tabs.slice(1)) {
      await browser.tabs.remove(tab.id);
    }
  });

  afterEach(async () => {
    if (lanthan) {
      await lanthan.quit();
    }
  });

  it("switch to form settings", async () => {
    const page = await OptionPage.open(lanthan);
    await page.switchToForm();

    const { settings } = await browser.storage.local.get("settings");
    assert.strictEqual(settings.source, "form");
  });

  it("add blacklist item", async () => {
    const page = await OptionPage.open(lanthan);
    const forms = await page.switchToForm();

    // assert default
    let settings = (await browser.storage.local.get("settings")).settings;
    assert.deepStrictEqual(settings.form.blacklist, []);

    // add blacklist items
    await forms.addBlacklist();
    await forms.setBlacklist(0, "google.com");

    settings = (await browser.storage.local.get("settings")).settings;
    assert.deepStrictEqual(settings.form.blacklist, ["google.com"]);

    await forms.addBlacklist();
    await forms.setBlacklist(1, "yahoo.com");

    settings = (await browser.storage.local.get("settings")).settings;
    assert.deepStrictEqual(settings.form.blacklist, [
      "google.com",
      "yahoo.com",
    ]);

    // delete first item
    await forms.removeBlackList(0);
    settings = (await browser.storage.local.get("settings")).settings;
    assert.deepStrictEqual(settings.form.blacklist, ["yahoo.com"]);
  });

  it("add a partial blacklist item", async () => {
    const page = await OptionPage.open(lanthan);
    const forms = await page.switchToForm();

    // assert default
    let settings = (await browser.storage.local.get("settings")).settings;
    assert.deepStrictEqual(settings.form.blacklist, []);

    // add blacklist items
    await forms.addPartialBlacklist();
    await forms.setPartialBlacklist(0, "google.com", "j,k,<C-U>");

    settings = (await browser.storage.local.get("settings")).settings;
    assert.deepStrictEqual(settings.form.blacklist, [
      { url: "google.com", keys: ["j", "k", "<C-U>"] },
    ]);

    await forms.addPartialBlacklist();
    await forms.setPartialBlacklist(1, "yahoo.com", "g,G");

    settings = (await browser.storage.local.get("settings")).settings;
    assert.deepStrictEqual(settings.form.blacklist, [
      { url: "google.com", keys: ["j", "k", "<C-U>"] },
      { url: "yahoo.com", keys: ["g", "G"] },
    ]);

    await forms.addBlacklist();
    await forms.setBlacklist(0, "bing.com");

    settings = (await browser.storage.local.get("settings")).settings;
    assert.deepStrictEqual(settings.form.blacklist, [
      { url: "google.com", keys: ["j", "k", "<C-U>"] },
      { url: "yahoo.com", keys: ["g", "G"] },
      "bing.com",
    ]);

    // delete first item
    await forms.removePartialBlackList(0);
    settings = (await browser.storage.local.get("settings")).settings;
    assert.deepStrictEqual(settings.form.blacklist, [
      { url: "yahoo.com", keys: ["g", "G"] },
      "bing.com",
    ]);
  });

  it("add search engines", async () => {
    const page = await OptionPage.open(lanthan);
    const forms = await page.switchToForm();

    // assert default
    let settings = (await browser.storage.local.get("settings")).settings;
    assert.deepStrictEqual(settings.form.search.default, "google");

    // change default
    await forms.setDefaultSearchEngine(2);
    settings = (await browser.storage.local.get("settings")).settings;
    assert.deepStrictEqual(settings.form.search.default, "bing");

    await forms.addSearchEngine();
    await forms.setSearchEngine(
      6,
      "yippy",
      "https://www.yippy.com/search?query={}"
    );

    settings = (await browser.storage.local.get("settings")).settings;
    assert.deepStrictEqual(settings.form.search.engines[6], [
      "yippy",
      "https://www.yippy.com/search?query={}",
    ]);
  });
});
