import express from 'express';
import * as path from 'path';
import * as assert from 'assert';
import * as http from 'http';

import eventually from './eventually';
import { Builder, Lanthan } from 'lanthan';
import { WebDriver, Key } from 'selenium-webdriver';
import Page from './lib/Page';

const newApp = () => {
  let app = express();

  app.get('/', (_req, res) => {
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

describe('follow properties test', () => {
  const port = 12321;
  let http: http.Server;
  let lanthan: Lanthan;
  let webdriver: WebDriver;
  let browser: any;
  let page: Page;

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
    page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}`);
  });

  afterEach(async() => {
    let tabs = await browser.tabs.query({});
    for (let tab of tabs.slice(1)) {
      await browser.tabs.remove(tab.id);
    }
  });

  it('should show hints with hintchars by settings', async () => {
    await page.sendKeys('f');

    let hints = await page.waitAndGetHints();
    assert.equal(hints.length, 5);

    assert.equal(hints[0].text, 'J');
    assert.equal(hints[1].text, 'K');
    assert.equal(hints[2].text, 'JJ');
    assert.equal(hints[3].text, 'JK');
    assert.equal(hints[4].text, 'KJ');

    await page.sendKeys('j');
    hints = await page.waitAndGetHints();

    assert.equal(hints[0].displayed, true);
    assert.equal(hints[1].displayed, false);
    assert.equal(hints[2].displayed, true);
    assert.equal(hints[3].displayed, true);
    assert.equal(hints[4].displayed, false);
  });

  it('should open tab in background by background:false', async () => {
    await page.sendKeys(Key.SHIFT, 'f');
    await page.waitAndGetHints();
    await page.sendKeys('jj');

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.equal(tabs[0].active, false);
      assert.equal(tabs[1].active, true);
    });
  });

  it('should open tab in background by background:true', async () => {
    await page.sendKeys(Key.CONTROL, 'f');
    await page.waitAndGetHints();
    await page.sendKeys('jj');

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.equal(tabs[0].active, true);
      assert.equal(tabs[1].active, false);
    });
  });

  it('should show hints with hintchars by settings', async () => {
    let console = await page.showConsole();
    await console.execCommand('set hintchars=abc');
    await (webdriver.switchTo() as any).parentFrame();

    await page.sendKeys('f');
    let hints = await page.waitAndGetHints();
    assert.equal(hints.length, 5);
    assert.equal(hints[0].text, 'A');
    assert.equal(hints[1].text, 'B');
    assert.equal(hints[2].text, 'C');
    assert.equal(hints[3].text, 'AA');
    assert.equal(hints[4].text, 'AB');

    await page.sendKeys('a');
    hints = await page.waitAndGetHints();
    assert.equal(hints[0].displayed, true);
    assert.equal(hints[1].displayed, false);
    assert.equal(hints[2].displayed, false);
    assert.equal(hints[3].displayed, true);
    assert.equal(hints[4].displayed, true);
  });
});
