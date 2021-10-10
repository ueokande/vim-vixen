import * as path from "path";
import * as assert from "assert";

import TestServer from "./lib/TestServer";
import eventually from "./eventually";
import { Builder, Lanthan } from "lanthan";
import { WebDriver } from "selenium-webdriver";
import Page from "./lib/Page";

describe("addbookmark command test", () => {
  const server = new TestServer().receiveContent(
    "/happy",
    `
      <!DOCTYPE html>
      <html lang="en"><head><title>how to be happy</title></head></html>`
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
    await server.stop();
    if (lanthan) {
      await lanthan.quit();
    }
  });

  beforeEach(async () => {
    await webdriver.navigate().to(server.url("/happy"));
  });

  it("should add a bookmark from the current page", async () => {
    const page = await Page.currentContext(webdriver);
    const console = await page.showConsole();
    await console.execCommand("addbookmark how to be happy");

    await eventually(async () => {
      const bookmarks = await browser.bookmarks.search({
        title: "how to be happy",
      });
      assert.strictEqual(bookmarks.length, 1);
      assert.strictEqual(bookmarks[0].url, server.url("/happy"));
    });
  });
});
