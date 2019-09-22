import express from 'express';
import * as path from 'path';
import * as assert from 'assert';
import * as http from 'http';

import settings from './settings';
import eventually from './eventually';
import { Builder, Lanthan } from 'lanthan';
import { WebDriver, WebElement, By, Key } from 'selenium-webdriver';
import { Console } from './lib/Console';

const newApp = () => {
  let app = express();
  app.get('/', (_req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <body>ok</body>
</html">`);
  });
  return app;
};

describe("general completion test", () => {
  const port = 12321;
  let http: http.Server;
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
    http = newApp().listen(port);

    await browser.storage.local.set({
      settings,
    });
  });

  after(async() => {
    http.close();
    if (lanthan) {
      await lanthan.quit();
    }
  });

  beforeEach(async() => {
    await webdriver.navigate().to(`http://127.0.0.1:${port}`);
    body = await webdriver.findElement(By.css('body'));
  });

  it('should all commands on empty line', async() => {
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let c = new Console(webdriver);

    await eventually(async() => {
      let items = await c.getCompletions();
      assert.equal(items.length, 10);
      assert.deepEqual(items[0], { type: 'title', text: 'Console Command' });
      assert.ok(items[1].text.startsWith('set'))
      assert.ok(items[2].text.startsWith('open'))
      assert.ok(items[3].text.startsWith('tabopen'))
    });
  });

  it('should only commands filtered by prefix', async() => {
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let c = new Console(webdriver);
    await c.sendKeys('b');

    await eventually(async() => {
      let items = await c.getCompletions();
      assert.equal(items.length, 4);
      assert.deepEqual(items[0], { type: 'title', text: 'Console Command' });
      assert.ok(items[1].text.startsWith('buffer'))
      assert.ok(items[2].text.startsWith('bdelete'))
      assert.ok(items[3].text.startsWith('bdeletes'))
    });
  });

  it('selects completion items by <Tab>/<S-Tab> keys', async() => {
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let c = new Console(webdriver);
    await c.sendKeys('b');

    await eventually(async() => {
      let items = await c.getCompletions();
      assert.equal(items.length, 4);
    });

    await c.sendKeys(Key.TAB);
    await eventually(async() => {
      let items = await c.getCompletions();
      assert.ok(items[1].highlight)

      let v = await c.currentValue();
      assert.equal(v, 'buffer');
    });

    await c.sendKeys(Key.TAB, Key.TAB);
    await eventually(async() => {
      let items = await c.getCompletions();
      assert.ok(items[3].highlight)

      let v = await c.currentValue();
      assert.equal(v, 'bdeletes');
    });

    await c.sendKeys(Key.TAB);
    await eventually(async() => {
      let v = await c.currentValue();
      assert.equal(v, 'b');
    });

    await c.sendKeys(Key.SHIFT, Key.TAB);
    await eventually(async() => {
      let items = await c.getCompletions();
      assert.ok(items[3].highlight)

      let v = await c.currentValue();
      assert.equal(v, 'bdeletes');
    });
  });
});
