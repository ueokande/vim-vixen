import * as path from "path";
import * as assert from "assert";

import TestServer from "./lib/TestServer";
import eventually from "./eventually";
import { Builder, Lanthan } from "lanthan";
import { WebDriver } from "selenium-webdriver";
import Page from "./lib/Page";

describe("quit/quitall command test", () => {
  const server = new TestServer().receiveContent("/*", "ok");
  let lanthan: Lanthan;
  let webdriver: WebDriver;
  let browser: any;

  before(async () => {
    lanthan = await Builder.forBrowser("firefox")
      .spyAddon(path.join(__dirname, ".."))
      .build();
    webdriver = lanthan.getWebDriver();
    browser = lanthan.getWebExtBrowser();
    await server.start();
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
    await browser.tabs.update(tabs[0].id, { url: server.url("/site1") });
    for (let i = 2; i <= 5; ++i) {
      await browser.tabs.create({ url: server.url("/site" + i) });
    }

    await eventually(async () => {
      const handles = await webdriver.getAllWindowHandles();
      assert.strictEqual(handles.length, 5);
      await webdriver.switchTo().window(handles[2]);
    });
  });

  it("should current tab by q command", async () => {
    const page = await Page.currentContext(webdriver);
    const console = await page.showConsole();
    await console.execCommand("q");

    await eventually(async () => {
      const tabs = await browser.tabs.query({});
      assert.strictEqual(tabs.length, 4);
    });
  });

  it("should current tab by quit command", async () => {
    const page = await Page.currentContext(webdriver);
    const console = await page.showConsole();
    await console.execCommand("quit");

    await eventually(async () => {
      const tabs = await browser.tabs.query({});
      assert.strictEqual(tabs.length, 4);
    });
  });

  it("should current tab by qa command", async () => {
    const page = await Page.currentContext(webdriver);
    const console = await page.showConsole();
    await console.execCommand("qa");

    await eventually(async () => {
      const tabs = await browser.tabs.query({});
      assert.strictEqual(tabs.length, 1);
    });
  });

  it("should current tab by quitall command", async () => {
    const page = await Page.currentContext(webdriver);
    const console = await page.showConsole();
    await console.execCommand("quitall");

    await eventually(async () => {
      const tabs = await browser.tabs.query({});
      assert.strictEqual(tabs.length, 1);
    });
  });
});
