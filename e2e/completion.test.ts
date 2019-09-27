import * as path from 'path';
import * as assert from 'assert';

import eventually from './eventually';
import settings from './settings';
import { Builder, Lanthan } from 'lanthan';
import { WebDriver, Key } from 'selenium-webdriver';
import Page from './lib/Page';

describe("general completion test", () => {
  let lanthan: Lanthan;
  let webdriver: WebDriver;
  let browser: any;
  let page: Page;

  before(async() => {
    lanthan = await Builder
      .forBrowser('firefox')
      .spyAddon(path.join(__dirname, '..'))
      .build();
    webdriver = lanthan.getWebDriver();
    browser = lanthan.getWebExtBrowser();

    await browser.storage.local.set({
      settings,
    });
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
    let console = await page.showConsole();

    let items = await console.getCompletions();
    assert.equal(items.length, 10);
    assert.deepEqual(items[0], { type: 'title', text: 'Console Command' });
    assert.ok(items[1].text.startsWith('set'))
    assert.ok(items[2].text.startsWith('open'))
    assert.ok(items[3].text.startsWith('tabopen'))
  });

  it('should only commands filtered by prefix', async() => {
    let console = await page.showConsole();
    await console.inputKeys('b');

    let items = await console.getCompletions();
    assert.equal(items.length, 4);
    assert.deepEqual(items[0], { type: 'title', text: 'Console Command' });
    assert.ok(items[1].text.startsWith('buffer'))
    assert.ok(items[2].text.startsWith('bdelete'))
    assert.ok(items[3].text.startsWith('bdeletes'))
  });

  // > byffer
  // > bdelete
  // > bdeletes
  // : b
  it('selects completion items by <Tab>/<S-Tab> keys', async() => {
    let console = await page.showConsole();
    await console.inputKeys('b');
    await eventually(async() => {
      let items = await console.getCompletions();
      assert.equal(items.length, 4);
    });

    await console.sendKeys(Key.TAB);
    await eventually(async() => {
      let items = await console.getCompletions();
      assert.ok(items[1].highlight)
      assert.equal(await console.currentValue(), 'buffer');
    });

    await console.sendKeys(Key.TAB, Key.TAB);
    await eventually(async() => {
      let items = await console.getCompletions();
      assert.ok(items[3].highlight)
      assert.equal(await console.currentValue(), 'bdeletes');
    });

    await console.sendKeys(Key.TAB);
    await eventually(async() => {
      assert.equal(await console.currentValue(), 'b');
    });

    await console.sendKeys(Key.SHIFT, Key.TAB);
    await eventually(async() => {
      let items = await console.getCompletions();
      assert.ok(items[3].highlight)
      assert.equal(await console.currentValue(), 'bdeletes');
    });
  });
});
