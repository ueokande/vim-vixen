import * as path from "path";
import * as assert from "assert";

import TestServer from "./lib/TestServer";
import eventually from "./eventually";
import { Builder, Lanthan } from "lanthan";
import { WebDriver } from "selenium-webdriver";
import Page from "./lib/Page";
import OptionPage from "./lib/OptionPage";

describe("options page", () => {
  const server = new TestServer().receiveContent(
    "/",
    `<!DOCTYPE html><html lang="en"><body style="width:10000px; height:10000px"></body></html>`
  );
  let lanthan: Lanthan;
  let webdriver: WebDriver;
  let browser: any;

  beforeAll(async () => {
    lanthan = await Builder.forBrowser("firefox")
      .spyAddon(path.join(__dirname, ".."))
      .build();
    webdriver = lanthan.getWebDriver();
    browser = lanthan.getWebExtBrowser();

    await server.start();
  });

  afterAll(async () => {
    if (lanthan) {
      await lanthan.quit();
    }
    await server.stop();
  });

  beforeEach(async () => {
    const tabs = await browser.tabs.query({});
    for (const tab of tabs.slice(1)) {
      await browser.tabs.remove(tab.id);
    }
  });

  it("saves current config on blur", async () => {
    const page = await OptionPage.open(lanthan);
    const jsonPage = await page.asJSONOptionPage();
    await jsonPage.updateSettings(`{ "blacklist": [ "https://example.com" ] }`);

    let { settings } = await browser.storage.local.get("settings");
    assert.strictEqual(settings.source, "json");
    assert.strictEqual(
      settings.json,
      '{ "blacklist": [ "https://example.com" ] } '
    );

    await jsonPage.updateSettings(`invalid json`);

    settings = (await browser.storage.local.get("settings")).settings;
    assert.strictEqual(settings.source, "json");
    assert.strictEqual(
      settings.json,
      '{ "blacklist": [ "https://example.com" ] } '
    );

    const message = await jsonPage.getErrorMessage();
    assert.ok(message.startsWith("SyntaxError:"));
  });

  it("updates keymaps without reloading", async () => {
    const optionPage = await OptionPage.open(lanthan);
    const jsonPage = await optionPage.asJSONOptionPage();
    await jsonPage.updateSettings(
      `{ "keymaps": { "zz": { "type": "scroll.vertically", "count": 10 } } }`
    );

    await browser.tabs.create({ url: server.url(), active: false });
    await new Promise((resolve) => setTimeout(resolve, 100));
    const handles = await webdriver.getAllWindowHandles();
    await webdriver.switchTo().window(handles[1]);

    const page = await Page.currentContext(webdriver);
    await page.sendKeys("zz");

    await eventually(async () => {
      const y = await page.getScrollY();
      assert.strictEqual(y, 640);
    });
  });
});
