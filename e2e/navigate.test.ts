import * as path from "path";
import * as assert from "assert";

import TestServer from "./lib/TestServer";
import eventually from "./eventually";
import { Builder, Lanthan } from "lanthan";
import { WebDriver, Key } from "selenium-webdriver";
import { Options as FirefoxOptions } from "selenium-webdriver/firefox";
import Page from "./lib/Page";

const newApp = () => {
  const server = new TestServer();
  server.handle("/pagenation-a/:page", (req, res) => {
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
        <a href="/pagenation-a/${Number(req.params.page) - 1}">prev</a>
        <a href="/pagenation-a/${Number(req.params.page) + 1}">next</a>
      </html>`);
  });

  server.handle("/pagenation-link/:page", (req, res) => {
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <link rel="prev" href="/pagenation-link/${
            Number(req.params.page) - 1
          }"></link>
          <link rel="next" href="/pagenation-link/${
            Number(req.params.page) + 1
          }"></link>
        </head>
      </html>`);
  });
  server.receiveContent(
    "/reload",
    `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <script>window.location.hash = Date.now()</script>
      </head>
      <body style="width:10000px; height:10000px"></body>
    </html>`
  );

  server.receiveContent("/*", `ok`);

  return server;
};

describe("navigate test", () => {
  const server = newApp();
  let lanthan: Lanthan;
  let webdriver: WebDriver;
  let browser: any;

  before(async () => {
    await server.start();

    const opts = (new FirefoxOptions() as any).setPreference(
      "browser.startup.homepage",
      server.url("/#home")
    );
    lanthan = await Builder.forBrowser("firefox")
      .setOptions(opts)
      .spyAddon(path.join(__dirname, ".."))
      .build();
    webdriver = lanthan.getWebDriver();
    browser = lanthan.getWebExtBrowser();
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
  });

  it("should go to parent path without hash by gu", async () => {
    const page = await Page.navigateTo(webdriver, server.url("/a/b/c"));
    await page.sendKeys("g", "u");

    await eventually(async () => {
      const tab = (await browser.tabs.query({}))[0];
      const url = new URL(tab.url);
      assert.strictEqual(url.pathname, `/a/b/`);
    });
  });

  it("should remove hash by gu", async () => {
    const page = await Page.navigateTo(webdriver, server.url("/a/b/c#hash"));
    await page.sendKeys("g", "u");

    await eventually(async () => {
      const tab = (await browser.tabs.query({}))[0];
      const url = new URL(tab.url);
      assert.strictEqual(url.hash, "");
      assert.strictEqual(url.pathname, `/a/b/c`);
    });
  });

  it("should go to root path by gU", async () => {
    const page = await Page.navigateTo(webdriver, server.url("/a/b/c#hash"));
    await page.sendKeys("g", Key.SHIFT, "u");

    await eventually(async () => {
      const tab = (await browser.tabs.query({}))[0];
      const url = new URL(tab.url);
      assert.strictEqual(url.pathname, `/`);
    });
  });

  it("should go back and forward in history by H and L", async () => {
    let page = await Page.navigateTo(webdriver, server.url("/first"));
    await page.navigateTo(server.url("/second"));
    await page.sendKeys(Key.SHIFT, "h");

    await eventually(async () => {
      const tab = (await browser.tabs.query({}))[0];
      const url = new URL(tab.url);
      assert.strictEqual(url.pathname, `/first`);
    });

    page = await Page.currentContext(webdriver);
    page.sendKeys(Key.SHIFT, "l");

    await eventually(async () => {
      const tab = (await browser.tabs.query({}))[0];
      const url = new URL(tab.url);
      assert.strictEqual(url.pathname, `/second`);
    });
  });

  it("should go previous and next page in <a> by [[ and ]]", async () => {
    const page = await Page.navigateTo(
      webdriver,
      server.url("/pagenation-a/10")
    );
    await page.sendKeys("[", "[");

    await eventually(async () => {
      const tab = (await browser.tabs.query({}))[0];
      const url = new URL(tab.url);
      assert.strictEqual(url.pathname, "/pagenation-a/9");
    });
  });

  it("should go next page in <a> by ]]", async () => {
    const page = await Page.navigateTo(
      webdriver,
      server.url("/pagenation-a/10")
    );
    await page.sendKeys("]", "]");

    await eventually(async () => {
      const tab = (await browser.tabs.query({}))[0];
      const url = new URL(tab.url);
      assert.strictEqual(url.pathname, "/pagenation-a/11");
    });
  });

  it("should go previous page in <link> by ]]", async () => {
    const page = await Page.navigateTo(
      webdriver,
      server.url("/pagenation-link/10")
    );
    await page.sendKeys("[", "[");

    await eventually(async () => {
      const tab = (await browser.tabs.query({}))[0];
      const url = new URL(tab.url);
      assert.strictEqual(url.pathname, "/pagenation-link/9");
    });
  });

  it("should go next page by in <link> by [[", async () => {
    const page = await Page.navigateTo(
      webdriver,
      server.url("/pagenation-link/10")
    );
    await page.sendKeys("]", "]");

    await eventually(async () => {
      const tab = (await browser.tabs.query({}))[0];
      const url = new URL(tab.url);
      assert.strictEqual(url.pathname, "/pagenation-link/11");
    });
  });

  it("should go to home page into current tab by gh", async () => {
    const page = await Page.navigateTo(webdriver, server.url());
    await page.sendKeys("g", "h");

    await eventually(async () => {
      const tab = (await browser.tabs.query({}))[0];
      const url = new URL(tab.url);
      assert.strictEqual(url.hash, "#home");
    });
  });

  it("should go to home page into current tab by gH", async () => {
    const page = await Page.navigateTo(webdriver, server.url());
    await page.sendKeys("g", Key.SHIFT, "H");

    await eventually(async () => {
      const tabs = await browser.tabs.query({});
      assert.strictEqual(tabs.length, 2);
      assert.strictEqual(new URL(tabs[0].url).hash, "");
      assert.strictEqual(new URL(tabs[1].url).hash, "#home");
      assert.strictEqual(tabs[1].active, true);
    });
  });

  it("should reload current tab by r", async () => {
    const page = await Page.navigateTo(webdriver, server.url("/reload"));
    await page.scrollTo(500, 500);

    let before: number;
    await eventually(async () => {
      const tab = (await browser.tabs.query({}))[0];
      before = Number(new URL(tab.url).hash.split("#")[1]);
      assert.ok(before > 0);
    });

    await page.sendKeys("r");

    let after;
    await eventually(async () => {
      const tab = (await browser.tabs.query({}))[0];
      after = Number(new URL(tab.url).hash.split("#")[1]);
      assert.ok(after > before);
    });

    await eventually(async () => {
      const page = await Page.currentContext(webdriver);
      assert.strictEqual(await page.getScrollX(), 500);
    });
  });

  it("should reload current tab without cache by R", async () => {
    const page = await Page.navigateTo(webdriver, server.url("/reload"));
    await page.scrollTo(500, 500);

    let before: number;
    await eventually(async () => {
      const tab = (await browser.tabs.query({}))[0];
      before = Number(new URL(tab.url).hash.split("#")[1]);
      assert.ok(before > 0);
    });

    await page.sendKeys(Key.SHIFT, "R");

    let after;
    await eventually(async () => {
      const tab = (await browser.tabs.query({}))[0];
      after = Number(new URL(tab.url).hash.split("#")[1]);
      assert.ok(after > before);
    });

    await eventually(async () => {
      const page = await Page.currentContext(webdriver);
      assert.strictEqual(await page.getScrollY(), 0);
    });
  });
});
