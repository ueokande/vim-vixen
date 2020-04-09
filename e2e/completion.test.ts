import * as path from 'path';
import * as assert from 'assert';

import eventually from './eventually';
import { Builder, Lanthan } from 'lanthan';
import { WebDriver, Key } from 'selenium-webdriver';
import Page from './lib/Page';

describe("general completion test", () => {
  let lanthan: Lanthan;
  let webdriver: WebDriver;
  let page: Page;

  before(async() => {
    lanthan = await Builder
      .forBrowser('firefox')
      .spyAddon(path.join(__dirname, '..'))
      .build();
    webdriver = lanthan.getWebDriver();
  });

  after(async() => {
    if (lanthan) {
      await lanthan.quit();
    }
  });

  beforeEach(async() => {
    page = await Page.navigateTo(webdriver, 'about:blank');
  });

  it('should all commands on empty line', async() => {
    const console = await page.showConsole();

    const items = await console.getCompletions();
    assert.strictEqual(items.length, 12);
    assert.deepStrictEqual(items[0], { type: 'title', text: 'Console Command' });
    assert.ok(items[1].text.startsWith('set'));
    assert.ok(items[2].text.startsWith('open'));
    assert.ok(items[3].text.startsWith('tabopen'))
  });

  it('should only commands filtered by prefix', async() => {
    const console = await page.showConsole();
    await console.inputKeys('b');

    const items = await console.getCompletions();
    assert.strictEqual(items.length, 4);
    assert.deepStrictEqual(items[0], { type: 'title', text: 'Console Command' });
    assert.ok(items[1].text.startsWith('buffer'));
    assert.ok(items[2].text.startsWith('bdelete'));
    assert.ok(items[3].text.startsWith('bdeletes'))
  });

  // > byffer
  // > bdelete
  // > bdeletes
  // : b
  it('selects completion items by <Tab>/<S-Tab> keys', async() => {
    const console = await page.showConsole();
    await console.inputKeys('b');
    await eventually(async() => {
      const items = await console.getCompletions();
      assert.strictEqual(items.length, 4);
    });

    await console.sendKeys(Key.TAB);
    await eventually(async() => {
      const items = await console.getCompletions();
      assert.ok(items[1].highlight);
      assert.strictEqual(await console.currentValue(), 'buffer');
    });

    await console.sendKeys(Key.TAB, Key.TAB);
    await eventually(async() => {
      const items = await console.getCompletions();
      assert.ok(items[3].highlight);
      assert.strictEqual(await console.currentValue(), 'bdeletes');
    });

    await console.sendKeys(Key.TAB);
    await eventually(async() => {
      assert.strictEqual(await console.currentValue(), 'b');
    });

    await console.sendKeys(Key.SHIFT, Key.TAB);
    await eventually(async() => {
      const items = await console.getCompletions();
      assert.ok(items[3].highlight);
      assert.strictEqual(await console.currentValue(), 'bdeletes');
    });
  });
});
