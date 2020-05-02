import * as path from "path";
import * as assert from "assert";

import TestServer from "./lib/TestServer";
import eventually from "./eventually";
import { Builder, Lanthan } from "lanthan";
import { WebDriver, Key } from "selenium-webdriver";
import Page from "./lib/Page";
import SettingRepository from "./lib/SettingRepository";
import Settings from "../src/shared/settings/Settings";

describe("follow properties test", () => {
  const server = new TestServer().receiveContent(
    "/",
    `
    <!DOCTYPE html>
    <html lang="en"><body>
      <a href="/">link1</a>
      <a href="/">link2</a>
      <a href="/">link3</a>
      <a href="/">link4</a>
      <a href="/">link5</a>
    </body></html>`
  );

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

    await new SettingRepository(browser).saveJSON(
      Settings.fromJSON({
        keymaps: {
          ":": { type: "command.show" },
          f: { type: "follow.start", newTab: false },
          F: { type: "follow.start", newTab: true, background: false },
          "<C-F>": { type: "follow.start", newTab: true, background: true },
        },
        properties: {
          hintchars: "jk",
        },
      })
    );

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

  afterEach(async () => {
    const tabs = await browser.tabs.query({});
    for (const tab of tabs.slice(1)) {
      await browser.tabs.remove(tab.id);
    }
  });

  it("should show hints with hintchars by settings", async () => {
    await page.sendKeys("f");

    let hints = await page.waitAndGetHints();
    assert.strictEqual(hints.length, 5);

    assert.strictEqual(hints[0].text, "J");
    assert.strictEqual(hints[1].text, "K");
    assert.strictEqual(hints[2].text, "JJ");
    assert.strictEqual(hints[3].text, "JK");
    assert.strictEqual(hints[4].text, "KJ");

    await page.sendKeys("j");
    hints = await page.waitAndGetHints();

    assert.strictEqual(hints[0].displayed, true);
    assert.strictEqual(hints[1].displayed, false);
    assert.strictEqual(hints[2].displayed, true);
    assert.strictEqual(hints[3].displayed, true);
    assert.strictEqual(hints[4].displayed, false);
  });

  it("should open tab in background by background:false", async () => {
    await page.sendKeys(Key.SHIFT, "f");
    await page.waitAndGetHints();
    await page.sendKeys("jj");

    await eventually(async () => {
      const tabs = await browser.tabs.query({});
      assert.strictEqual(tabs[0].active, false);
      assert.strictEqual(tabs[1].active, true);
    });
  });

  it("should open tab in background by background:true", async () => {
    await page.sendKeys(Key.CONTROL, "f");
    await page.waitAndGetHints();
    await page.sendKeys("jj");

    await eventually(async () => {
      const tabs = await browser.tabs.query({});
      assert.strictEqual(tabs[0].active, true);
      assert.strictEqual(tabs[1].active, false);
    });
  });

  it("should show hints with hintchars by settings", async () => {
    const console = await page.showConsole();
    await console.execCommand("set hintchars=abc");
    await (webdriver.switchTo() as any).parentFrame();

    await page.sendKeys("f");
    let hints = await page.waitAndGetHints();
    assert.strictEqual(hints.length, 5);
    assert.strictEqual(hints[0].text, "A");
    assert.strictEqual(hints[1].text, "B");
    assert.strictEqual(hints[2].text, "C");
    assert.strictEqual(hints[3].text, "AA");
    assert.strictEqual(hints[4].text, "AB");

    await page.sendKeys("a");
    hints = await page.waitAndGetHints();
    assert.strictEqual(hints[0].displayed, true);
    assert.strictEqual(hints[1].displayed, false);
    assert.strictEqual(hints[2].displayed, false);
    assert.strictEqual(hints[3].displayed, true);
    assert.strictEqual(hints[4].displayed, true);
  });
});
