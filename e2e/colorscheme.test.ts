import * as path from "path";
import * as assert from "assert";

import TestServer from "./lib/TestServer";
import { Builder, Lanthan } from "lanthan";
import { WebDriver } from "selenium-webdriver";
import { Options as FirefoxOptions } from "selenium-webdriver/firefox";
import Page from "./lib/Page";

describe("colorscheme test", () => {
  const server = new TestServer();
  let lanthan: Lanthan;
  let webdriver: WebDriver;
  let page: Page;

  beforeAll(async () => {
    const opts = (new FirefoxOptions() as any).setPreference(
      "ui.systemUsesDarkTheme",
      1
    );

    lanthan = await Builder.forBrowser("firefox")
      .setOptions(opts)
      .spyAddon(path.join(__dirname, ".."))
      .build();
    webdriver = lanthan.getWebDriver();

    await server.start();
  });

  afterAll(async () => {
    await server.stop();
    if (lanthan) {
      await lanthan.quit();
    }
  });

  beforeEach(async () => {
    page = await Page.navigateTo(webdriver, server.url());
  });

  it("changes color scheme by set command", async () => {
    let console = await page.showConsole();

    await console.execCommand("set colorscheme=dark");
    await (webdriver.switchTo() as any).parentFrame();
    console = await page.showConsole();
    assert.strictEqual(await console.getTheme(), "dark");

    await console.execCommand("set colorscheme=light");
    await (webdriver.switchTo() as any).parentFrame();
    console = await page.showConsole();
    assert.strictEqual(await console.getTheme(), "light");

    await console.execCommand("set colorscheme=system");
    await (webdriver.switchTo() as any).parentFrame();
    console = await page.showConsole();
    assert.strictEqual(await console.getTheme(), "dark");
  });
});
