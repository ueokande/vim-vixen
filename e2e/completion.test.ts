import * as path from "path";
import * as assert from "assert";

import eventually from "./eventually";
import { Builder, Lanthan } from "lanthan";
import { WebDriver, Key } from "selenium-webdriver";
import Page from "./lib/Page";

describe("general completion test", () => {
  let lanthan: Lanthan;
  let webdriver: WebDriver;
  let page: Page;

  beforeAll(async () => {
    lanthan = await Builder.forBrowser("firefox")
      .spyAddon(path.join(__dirname, ".."))
      .build();
    webdriver = lanthan.getWebDriver();
  });

  afterAll(async () => {
    if (lanthan) {
      await lanthan.quit();
    }
  });

  beforeEach(async () => {
    page = await Page.navigateTo(webdriver, "about:blank");
  });

  it("should shows all commands on empty line", async () => {
    const console = await page.showConsole();

    const groups = await console.getCompletions();
    assert.strictEqual(groups.length, 1);
    assert.strictEqual(groups[0].title, "Console Command");
    assert.strictEqual(groups[0].items.length, 11);
  });

  it("should shows commands filtered by prefix", async () => {
    const console = await page.showConsole();
    await console.inputKeys("b");

    const groups = await console.getCompletions();
    const items = groups[0].items;
    assert.ok(items[0].text.startsWith("buffer"));
    assert.ok(items[1].text.startsWith("bdelete"));
    assert.ok(items[2].text.startsWith("bdeletes"));
  });

  // > byffer
  // > bdelete
  // > bdeletes
  // : b
  it("selects completion items by <Tab>/<S-Tab> keys", async () => {
    const console = await page.showConsole();
    await console.inputKeys("b");
    await eventually(async () => {
      const groups = await console.getCompletions();
      const items = groups[0].items;
      assert.strictEqual(items.length, 3);
    });

    await console.sendKeys(Key.TAB);
    await eventually(async () => {
      const groups = await console.getCompletions();
      const items = groups[0].items;
      assert.ok(items[0].highlight);
      assert.strictEqual(await console.currentValue(), "buffer");
    });

    await console.sendKeys(Key.TAB, Key.TAB);
    await eventually(async () => {
      const groups = await console.getCompletions();
      const items = groups[0].items;
      assert.ok(items[2].highlight);
      assert.strictEqual(await console.currentValue(), "bdeletes");
    });

    await console.sendKeys(Key.TAB);
    await eventually(async () => {
      assert.strictEqual(await console.currentValue(), "b");
    });

    await console.sendKeys(Key.SHIFT, Key.TAB);
    await eventually(async () => {
      const groups = await console.getCompletions();
      const items = groups[0].items;
      assert.ok(items[2].highlight);
      assert.strictEqual(await console.currentValue(), "bdeletes");
    });
  });
});
