import * as path from "path";
import * as assert from "assert";

import eventually from "./eventually";
import { Builder, Lanthan } from "lanthan";
import { WebDriver } from "selenium-webdriver";
import Page from "./lib/Page";

describe("zoom test", () => {
  let lanthan: Lanthan;
  let webdriver: WebDriver;
  let browser: any;
  let tab: any;
  let page: Page;

  beforeAll(async () => {
    lanthan = await Builder.forBrowser("firefox")
      .spyAddon(path.join(__dirname, ".."))
      .build();
    webdriver = lanthan.getWebDriver();
    browser = lanthan.getWebExtBrowser();
    tab = (await browser.tabs.query({}))[0];
    page = await Page.currentContext(webdriver);
  });

  afterAll(async () => {
    await lanthan.quit();
  });

  beforeEach(async () => {
    await webdriver.navigate().to("about:blank");
  });

  it("should zoom in by zi", async () => {
    const before = await browser.tabs.getZoom(tab.id);
    await page.sendKeys("zi");

    await eventually(async () => {
      const actual = await browser.tabs.getZoom(tab.id);
      assert.ok(before < actual);
    });
  });

  it("should zoom out by zo", async () => {
    const before = await browser.tabs.getZoom(tab.id);
    await page.sendKeys("zo");

    await eventually(async () => {
      const actual = await browser.tabs.getZoom(tab.id);
      assert.ok(before > actual);
    });
  });

  it("should reset zoom by zz", async () => {
    await browser.tabs.setZoom(tab.id, 2);
    await page.sendKeys("zz");

    await eventually(async () => {
      const actual = await browser.tabs.getZoom(tab.id);
      assert.strictEqual(actual, 1);
    });
  });
});
