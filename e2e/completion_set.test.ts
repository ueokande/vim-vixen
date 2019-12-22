import * as path from 'path';
import * as assert from 'assert';

import eventually from './eventually';
import { Builder, Lanthan } from 'lanthan';
import { WebDriver } from 'selenium-webdriver';
import Page from './lib/Page';

describe("completion on set commands", () => {
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
    page = await Page.navigateTo(webdriver, `about:blank`);
  });

  it('should show all property names by "set" command with empty params', async() => {
    const console = await page.showConsole();
    await console.inputKeys('set ');

    await eventually(async() => {
      const items = await console.getCompletions();
      assert.strictEqual(items.length, 5);
      assert.deepStrictEqual(items[0], { type: 'title', text: 'Properties' });
      assert.ok(items[1].text.startsWith('hintchars'));
      assert.ok(items[2].text.startsWith('smoothscroll'));
      assert.ok(items[3].text.startsWith('nosmoothscroll'));
      assert.ok(items[4].text.startsWith('complete'))
    });
  });

  it('should show filtered property names by "set" command', async() => {
    const console = await page.showConsole();
    await console.inputKeys('set no');

    await eventually(async() => {
      const items = await console.getCompletions();
      assert.strictEqual(items.length, 2);
      assert.ok(items[1].text.includes('nosmoothscroll'))
    });
  });
});
