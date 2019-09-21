const express = require('express');
const path = require('path');
const assert = require('assert');
const eventually = require('./eventually');
const settings = require('./settings');
const { Builder } = require('lanthan');
const { By, Key } = require('selenium-webdriver');
const Console = require('./lib/Console');

const newApp = () => {
  let app = express();
  app.get('/', (req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <body>ok</body>
</html">`);
  });
  return app;
};

describe("general completion test", () => {
  const port = 12321;
  let http;
  let lanthan;
  let webdriver;
  let browser;
  let body;

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
      assert(items[1].text.startsWith('set'))
      assert(items[2].text.startsWith('open'))
      assert(items[3].text.startsWith('tabopen'))
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
      assert(items[1].text.startsWith('buffer'))
      assert(items[2].text.startsWith('bdelete'))
      assert(items[3].text.startsWith('bdeletes'))
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
      assert(items[1].highlight)

      let v = await c.currentValue();
      assert.equal(v, 'buffer');
    });

    await c.sendKeys(Key.TAB, Key.TAB);
    await eventually(async() => {
      let items = await c.getCompletions();
      assert(items[3].highlight)

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
      assert(items[3].highlight)

      let v = await c.currentValue();
      assert.equal(v, 'bdeletes');
    });
  });
});
