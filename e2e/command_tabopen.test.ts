import * as path from "path";
import * as assert from "assert";

import TestServer from "./lib/TestServer";
import eventually from "./eventually";
import { Builder, Lanthan } from "lanthan";
import { WebDriver } from "selenium-webdriver";
import Page from "./lib/Page";
import SettingRepository from "./lib/SettingRepository";
import Settings from "../src/shared/settings/Settings";

describe("tabopen command test", () => {
  const server = new TestServer()
    .receiveContent("/google", "google")
    .receiveContent("/yahoo", "yahoo");
  let lanthan: Lanthan;
  let webdriver: WebDriver;
  let browser: any;
  let page: Page;

  before(async () => {
    lanthan = await Builder.forBrowser("firefox")
      .spyAddon(path.join(__dirname, ".."))
      .build();
    webdriver = lanthan.getWebDriver();
    browser = lanthan.getWebExtBrowser();

    await server.start();
    await new SettingRepository(browser).saveJSON(
      Settings.fromJSON({
        search: {
          default: "google",
          engines: {
            google: server.url("/google?q={}"),
            yahoo: server.url("/yahoo?q={}"),
          },
        },
      })
    );
  });

  after(async () => {
    await server.stop();
    if (lanthan) {
      await lanthan.quit();
    }
  });

  beforeEach(async () => {
    const tabs = await browser.tabs.query({});
    for (const tab of tabs.slice(1)) {
      await browser.tabs.remove(tab.id);
    }

    page = await Page.navigateTo(webdriver, server.url());
  });

  it("should open default search for keywords by tabopen command ", async () => {
    const console = await page.showConsole();
    await console.execCommand("tabopen an apple");

    await eventually(async () => {
      const tabs = await browser.tabs.query({});
      assert.strictEqual(tabs.length, 2);
      const url = new URL(tabs[1].url);
      assert.strictEqual(url.href, server.url("/google?q=an%20apple"));
    });
  });

  it("should open certain search page for keywords by tabopen command ", async () => {
    const console = await page.showConsole();
    await console.execCommand("tabopen yahoo an apple");

    await eventually(async () => {
      const tabs = await browser.tabs.query({});
      assert.strictEqual(tabs.length, 2);
      const url = new URL(tabs[1].url);
      assert.strictEqual(url.href, server.url("/yahoo?q=an%20apple"));
    });
  });

  it("should open default engine with empty keywords by tabopen command ", async () => {
    const console = await page.showConsole();
    await console.execCommand("tabopen");

    await eventually(async () => {
      const tabs = await browser.tabs.query({});
      assert.strictEqual(tabs.length, 2);
      const url = new URL(tabs[1].url);
      assert.strictEqual(url.href, server.url("/google?q="));
    });
  });

  it("should open certain search page for empty keywords by tabopen command ", async () => {
    const console = await page.showConsole();
    await console.execCommand("tabopen yahoo");

    await eventually(async () => {
      const tabs = await browser.tabs.query({});
      assert.strictEqual(tabs.length, 2);
      const url = new URL(tabs[1].url);
      assert.strictEqual(url.href, server.url("/yahoo?q="));
    });
  });

  it("should open a site with domain by tabopen command ", async () => {
    const console = await page.showConsole();
    await console.execCommand("tabopen example.com");

    await eventually(async () => {
      const tabs = await browser.tabs.query({});
      assert.strictEqual(tabs.length, 2);
      const url = new URL(tabs[1].url);
      assert.strictEqual(url.href, "http://example.com/");
    });
  });

  it("should open a site with URL by tabopen command ", async () => {
    const console = await page.showConsole();
    await console.execCommand("tabopen https://example.com/");

    await eventually(async () => {
      const tabs = await browser.tabs.query({});
      assert.strictEqual(tabs.length, 2);
      const url = new URL(tabs[1].url);
      assert.strictEqual(url.href, "https://example.com/");
    });
  });
});
