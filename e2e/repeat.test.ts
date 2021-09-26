import * as path from "path";
import * as assert from "assert";

import TestServer from "./lib/TestServer";
import eventually from "./eventually";
import { Builder, Lanthan } from "lanthan";
import { WebDriver } from "selenium-webdriver";
import Page from "./lib/Page";

describe("tab test", () => {
  const server = new TestServer().receiveContent("/*", "ok");
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
    await server.stop();
    if (lanthan) {
      await lanthan.quit();
    }
  });

  it("repeats last command", async () => {
    let page = await Page.navigateTo(webdriver, server.url());
    const console = await page.showConsole();
    await console.execCommand(`tabopen ${server.url("/newtab")}`);

    await eventually(async () => {
      const current = await browser.tabs.query({ url: `*://*/newtab` });
      assert.strictEqual(current.length, 1);
    });

    page = await Page.currentContext(webdriver);
    await page.sendKeys(".");

    await eventually(async () => {
      const current = await browser.tabs.query({ url: `*://*/newtab` });
      assert.strictEqual(current.length, 2);
    });
  });

  it("repeats last operation", async () => {
    for (let i = 1; i < 5; ++i) {
      await browser.tabs.create({ url: server.url("/#" + i) });
    }
    const before = await browser.tabs.query({});

    let page = await Page.currentContext(webdriver);
    await page.sendKeys("d");

    await eventually(async () => {
      const current = await browser.tabs.query({});
      assert.strictEqual(current.length, before.length - 1);
    });

    await browser.tabs.update(before[2].id, { active: true });
    page = await Page.currentContext(webdriver);
    await page.sendKeys(".");

    await eventually(async () => {
      const current = await browser.tabs.query({});
      assert.strictEqual(current.length, before.length - 2);
    });
  });
});
