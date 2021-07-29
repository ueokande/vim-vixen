import * as path from "path";
import * as assert from "assert";

import eventually from "./eventually";
import TestServer from "./lib/TestServer";
import { Builder, Lanthan } from "lanthan";
import { Key, WebDriver } from "selenium-webdriver";
import Page from "./lib/Page";

describe("find test", () => {
  const server = new TestServer().receiveContent(
    "/",
    `<!DOCTYPE html><html lang="en"><body>--hello--hello--hello--</body></html>`
  );
  let lanthan: Lanthan;
  let webdriver: WebDriver;
  let page: Page;

  before(async () => {
    lanthan = await Builder.forBrowser("firefox")
      .spyAddon(path.join(__dirname, ".."))
      .build();
    webdriver = lanthan.getWebDriver();
    await server.start();
  });

  after(async () => {
    await server.stop();
    if (lanthan) {
      await lanthan.quit();
    }
  });

  beforeEach(async () => {
    page = await Page.navigateTo(webdriver, server.url());
  });

  it("starts searching", async () => {
    await page.sendKeys("/");
    const console = await page.getConsole();
    await console.execCommand("hello");
    await page.switchToTop();

    await eventually(async () => {
      const selection = await page.getSelection();
      assert.deepStrictEqual(selection, { from: 2, to: 7 });
    });

    // search next keyword
    await page.sendKeys("n");
    await eventually(async () => {
      const selection = await page.getSelection();
      assert.deepStrictEqual(selection, { from: 9, to: 14 });
    });

    // search previous keyword
    await page.sendKeys(Key.SHIFT, "N");
    await eventually(async () => {
      const selection = await page.getSelection();
      assert.deepStrictEqual(selection, { from: 2, to: 7 });
    });

    // search previous keyword by wrap-search
    await page.sendKeys(Key.SHIFT, "N");
    await eventually(async () => {
      const selection = await page.getSelection();
      assert.deepStrictEqual(selection, { from: 16, to: 21 });
    });
  });

  it("shows error if pattern not found", async () => {
    await page.sendKeys("/");
    let console = await page.getConsole();
    await console.execCommand("world");

    await page.switchToTop();
    await eventually(async () => {
      const selection = await page.getSelection();
      assert.deepStrictEqual(selection, { from: 0, to: 0 });
    });

    await eventually(async () => {
      console = await page.getConsole();
      const message = await console.getErrorMessage();
      assert.strictEqual(message, "Pattern not found: world");
    });
  });

  it("search with last keyword if keyword is empty", async () => {
    await page.sendKeys("/");
    let console = await page.getConsole();
    await console.execCommand("hello");
    await page.switchToTop();

    await page.clearSelection();
    await eventually(async () => {
      const selection = await page.getSelection();
      assert.deepStrictEqual(selection, { from: 0, to: 0 });
    });

    await page.sendKeys("/");
    console = await page.getConsole();
    await console.execCommand("");
    await page.switchToTop();

    await eventually(async () => {
      const selection = await page.getSelection();
      assert.deepStrictEqual(selection, { from: 2, to: 7 });
    });
  });

  it("search with last keyword on new page", async () => {
    await page.sendKeys("/");
    const console = await page.getConsole();
    await console.execCommand("hello");

    await page.switchToTop();
    await page.sendKeys("n");
    await eventually(async () => {
      const selection = await page.getSelection();
      assert.deepStrictEqual(selection, { from: 9, to: 14 });
    });

    page = await Page.navigateTo(webdriver, server.url());
    await page.sendKeys("n");
    await eventually(async () => {
      const selection = await page.getSelection();
      assert.deepStrictEqual(selection, { from: 2, to: 7 });
    });
  });
});
