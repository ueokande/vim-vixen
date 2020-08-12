import * as path from "path";
import * as assert from "assert";

import TestServer from "./lib/TestServer";
import eventually from "./eventually";
import { Builder, Lanthan } from "lanthan";
import { WebDriver } from "selenium-webdriver";
import Page from "./lib/Page";

describe("mark test", () => {
  const server = new TestServer().receiveContent(
    "/",
    `<!DOCTYPE html><html lang="en"><body style="width:10000px; height:10000px"></body></html>`
  );
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

  it("should set a local mark and jump to it", async () => {
    const page = await Page.navigateTo(webdriver, server.url());
    await page.scrollTo(200, 200);
    await page.sendKeys("m", "a");
    await page.scrollTo(500, 500);
    await page.sendKeys("'", "a");

    await eventually(async () => {
      assert.strictEqual(await page.getScrollX(), 200);
      assert.strictEqual(await page.getScrollY(), 200);
    });
  });

  it("should set a global mark and jump to it", async () => {
    let page = await Page.navigateTo(webdriver, server.url("/#first"));
    await page.scrollTo(200, 200);
    await page.sendKeys("m", "A");
    await page.scrollTo(500, 500);
    await page.sendKeys("'", "A");

    await eventually(async () => {
      assert.strictEqual(await page.getScrollX(), 200);
      assert.strictEqual(await page.getScrollY(), 200);
    });

    await browser.tabs.create({ url: server.url("/#second") });
    page = await Page.currentContext(webdriver);
    await page.sendKeys("'", "A");

    await eventually(async () => {
      const tab = (await browser.tabs.query({ active: true }))[0];
      const url = new URL(tab.url);
      assert.strictEqual(url.hash, "#first");

      assert.strictEqual(await page.getScrollX(), 200);
      assert.strictEqual(await page.getScrollY(), 200);
    });
  });

  it("set a global mark and creates new tab from gone", async () => {
    let page = await Page.navigateTo(webdriver, server.url("/#first"));
    await page.scrollTo(500, 500);
    await page.sendKeys("m", "A");

    const tab = (await browser.tabs.query({ active: true }))[0];
    await browser.tabs.create({ url: server.url("/#second") });
    await browser.tabs.remove(tab.id);

    let handles: string[];
    await eventually(async () => {
      handles = await webdriver.getAllWindowHandles();
      assert.strictEqual(handles.length, 2);
    });
    await webdriver.switchTo().window(handles![0]);

    page = await Page.navigateTo(webdriver, server.url("/#second"));
    await page.sendKeys("'", "A");

    await eventually(async () => {
      const tab = (await browser.tabs.query({ active: true }))[0];
      const url = new URL(tab.url);
      assert.strictEqual(url.hash, "#first");
    });
  });
});
