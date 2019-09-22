import * as path from 'path';
import * as assert from 'assert';

import settings from './settings';
import eventually from './eventually';
import { Builder, Lanthan } from 'lanthan';
import { WebDriver, WebElement, By } from 'selenium-webdriver';
import { Console } from './lib/Console';

describe("completion on set commands", () => {
  let lanthan: Lanthan;
  let webdriver: WebDriver;
  let browser: any;
  let body: WebElement;

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
    await webdriver.navigate().to(`about:blank`);
    body = await webdriver.findElement(By.css('body'));
  });

  it('should show all property names by "set" command with empty params', async() => {
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let c = new Console(webdriver);
    await c.sendKeys('set ');

    await eventually(async() => {
      let items = await c.getCompletions();
      assert.equal(items.length, 5);
      assert.deepEqual(items[0], { type: 'title', text: 'Properties' });
      assert.ok(items[1].text.startsWith('hintchars'))
      assert.ok(items[2].text.startsWith('smoothscroll'))
      assert.ok(items[3].text.startsWith('nosmoothscroll'))
      assert.ok(items[4].text.startsWith('complete'))
    });
  });

  it('should show filtered property names by "set" command', async() => {
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let c = new Console(webdriver);
    await c.sendKeys('set no');

    await eventually(async() => {
      let items = await c.getCompletions();
      assert.equal(items.length, 2);
      assert.ok(items[1].text.includes('nosmoothscroll'))
    });
  });
});
