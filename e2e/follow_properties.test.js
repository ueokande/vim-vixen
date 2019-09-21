const express = require('express');
const path = require('path');
const assert = require('assert');
const eventually = require('./eventually');
const Console = require('./lib/Console');
const { Builder } = require('lanthan');
const { Key, By } = require('selenium-webdriver');

const newApp = () => {
  let app = express();

  app.get('/', (req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <body>
    <a href="/">link1</a>
    <a href="/">link2</a>
    <a href="/">link3</a>
    <a href="/">link4</a>
    <a href="/">link5</a>
  </body>
</html">`);
  });
  return app;
};

const waitForHints = async(webdriver) => {
  await eventually(async() => {
    let hints = await webdriver.findElements(By.css(`.vimvixen-hint`));
    assert(hints.length > 0);
  });
};

describe('follow properties test', () => {

  const port = 12321;
  let http;
  let lanthan;
  let webdriver;
  let browser;
  let body;

  before(async() => {
    http = newApp().listen(port);

    lanthan = await Builder
      .forBrowser('firefox')
      .spyAddon(path.join(__dirname, '..'))
      .build();
    webdriver = lanthan.getWebDriver();
    browser = lanthan.getWebExtBrowser();

    await browser.storage.local.set({ settings: {
      source: 'json',
      json: `{
        "keymaps": {
          ":": { "type": "command.show" },
          "f": { "type": "follow.start", "newTab": false },
          "F": { "type": "follow.start", "newTab": true, "background": false },
          "<C-F>": { "type": "follow.start", "newTab": true, "background": true }
        },
        "search": {
          "default": "google",
          "engines": { "google": "https://google.com/search?q={}" }
        },
        "properties": {
          "hintchars": "jk"
        }
      }`,
    }});
  });

  after(async() => {
    if (lanthan) {
      await lanthan.quit();
    }
    http.close();
  });

  beforeEach(async() => {
    await webdriver.navigate().to(`http://127.0.0.1:${port}/`);
    body = await webdriver.findElement(By.css('body'));
  });

  afterEach(async() => {
    let tabs = await browser.tabs.query({});
    for (let tab of tabs.slice(1)) {
      await browser.tabs.remove(tab.id);
    }
  });

  it('should show hints with hintchars by settings', async () => {
    await body.sendKeys('f');
    await eventually(async() => {
      let hints = await webdriver.findElements(By.css(`.vimvixen-hint`));
      assert.equal(hints.length, 5);

      assert.equal(await hints[0].getText(), 'J');
      assert.equal(await hints[1].getText(), 'K');
      assert.equal(await hints[2].getText(), 'JJ');
      assert.equal(await hints[3].getText(), 'JK');
      assert.equal(await hints[4].getText(), 'KJ');
    });

    await body.sendKeys('j');

    await eventually(async() => {
      let hints = await webdriver.findElements(By.css(`.vimvixen-hint`));

      assert.equal(await hints[0].getCssValue('display'), 'block');
      assert.equal(await hints[1].getCssValue('display'), 'none');
      assert.equal(await hints[2].getCssValue('display'), 'block');
      assert.equal(await hints[3].getCssValue('display'), 'block');
      assert.equal(await hints[4].getCssValue('display'), 'none');
    });
  });

  it('should open tab in background by background:false', async () => {
    await body.sendKeys(Key.SHIFT, 'f');
    await eventually(async() => {
      let hints = await webdriver.findElements(By.css(`.vimvixen-hint`));
      assert.equal(hints.length, 5);
    });
    await body.sendKeys('jj');

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.equal(tabs[0].active, false);
      assert.equal(tabs[1].active, true);
    });
  });

  it('should open tab in background by background:true', async () => {
    await body.sendKeys(Key.CONTROL, 'f');
    await eventually(async() => {
      let hints = await webdriver.findElements(By.css(`.vimvixen-hint`));
      assert.equal(hints.length, 5);
    });
    await body.sendKeys('jj');

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.equal(tabs[0].active, true);
      assert.equal(tabs[1].active, false);
    });
  });

  it('should show hints with hintchars by settings', async () => {
    let c = new Console(webdriver);

    await body.sendKeys(':');
    await webdriver.switchTo().frame(0);
    await c.sendKeys('set hintchars=abc', Key.ENTER);
    await new Promise(resolve => setTimeout(resolve, 100));
    await webdriver.switchTo().parentFrame();

    await body.sendKeys('f');
    await eventually(async() => {
      let hints = await webdriver.findElements(By.css(`.vimvixen-hint`));
      assert.equal(hints.length, 5);

      assert.equal(await hints[0].getText(), 'A');
      assert.equal(await hints[1].getText(), 'B');
      assert.equal(await hints[2].getText(), 'C');
      assert.equal(await hints[3].getText(), 'AA');
      assert.equal(await hints[4].getText(), 'AB');
    });

    await body.sendKeys('a');
    await eventually(async() => {
      let hints = await webdriver.findElements(By.css(`.vimvixen-hint`));

      assert.equal(await hints[0].getCssValue('display'), 'block');
      assert.equal(await hints[1].getCssValue('display'), 'none');
      assert.equal(await hints[2].getCssValue('display'), 'none');
      assert.equal(await hints[3].getCssValue('display'), 'block');
      assert.equal(await hints[4].getCssValue('display'), 'block');
    });
  });
});
