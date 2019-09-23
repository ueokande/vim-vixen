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
  <body><a href="hello">hello</a></body>
</html">`);
  });

  app.get('/follow-input', (_req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <body><input></body>
</html">`);
  });

  app.get('/area', (_req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <body>
    <img
      width="256" height="256"  usemap="#map"
      src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
    >
    <map name="map">
      <area shape="rect" coords="0,0,64,64" href="/">
      <area shape="rect" coords="64,64,64,64" href="/">
      <area shape="rect" coords="128,128,64,64" href="/">
    </map>
  </body>
</html">`);
  });
  
  /*
   * test case: link2 is out of the viewport
   * +-----------------+
   * |   [link1]       |<--- window
   * |                 |
   * |=================|<--- viewport
   * |   [link2]       |
   * |                 |
   * +-----------------+
   */
  app.get('/test1', (_req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <body>
  <div><a href="link1">link1</a></div>
  <div style="min-height:3000px"></div>
  <div><a href="link2">link2</a></div>
  </body>
</html">`);
  });

/*
 * test case 2: link2 and link3 are out of window of the frame
 * +-----------------+
 * | +-----------+   |
 * | | [link1]   |   |
 * |=================|
 * | | [link2]   |   |
 * | +-----------+   |
 * |                 |
 * +-----------------+
 */
  app.get('/test2', (_req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <body><iframe height="5000" src='/test2-frame'></body>
</html">`);
  });
  app.get('/test2-frame', (_req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <body>
  <div><a href="link1">link1</a></div>
  <div style="min-height:3000px"></div>
  <div><a href="link2">link2</a></div>
  </body>
</html">`);
  });

/* test case 3: link2 is out of window of the frame
 * +-----------------+
 * | +-----------+   |
 * | | [link1]   |   |
 * | +-----------+   |
 * | : [link2]   :   |
 * | + - - - - - +   |
 * |                 |
 * +-----------------+
 */
  app.get('/test3', (_req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <body><iframe src='/test3-frame'></body>
</html">`);
  });
  app.get('/test3-frame', (_req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <body>
  <div><a href="link1">link1</a></div>
  <div style="min-height:3000px"></div>
  <div><a href="link2">link2</a></div>
  </body>
</html">`);
  });

  return app;
};

describe('follow test', () => {

  const port = 12321;
  let http: http.Server;
  let lanthan: Lanthan;
  let webdriver: WebDriver;
  let browser: any;

  before(async() => {
    http = newApp().listen(port);
    lanthan = await Builder
      .forBrowser('firefox')
      .spyAddon(path.join(__dirname, '..'))
      .build();
    webdriver = lanthan.getWebDriver();
    browser = lanthan.getWebExtBrowser();
  });

  after(async() => {
    if (lanthan) {
      await lanthan.quit();
    }
    if (http) {
      http.close();
    }
  });

  afterEach(async() => {
    let tabs = await browser.tabs.query({});
    for (let tab of tabs.slice(1)) {
      await browser.tabs.remove(tab.id);
    }
  });

  it('should focus an input by f', async () => {
    let page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}/follow-input`);
    await page.sendKeys('f');
    await page.waitAndGetHints();
    await page.sendKeys('a');

    let tagName = await webdriver.executeScript(() => document.activeElement!!.tagName) as string;
    assert.equal(tagName.toLowerCase(), 'input');
  });

  it('should open a link by f', async () => {
    let page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}/`);
    await page.sendKeys('f');
    await page.waitAndGetHints();
    await page.sendKeys('a');

    await eventually(async() => {
      let hash = await webdriver.executeScript('return location.pathname');
      assert.equal(hash, '/hello');
    });
  });

  it('should focus an input by F', async () => {
    let page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}/follow-input`);
    await page.sendKeys(Key.SHIFT, 'f');
    await page.waitAndGetHints();
    await page.sendKeys('a');

    let tagName = await webdriver.executeScript(() => document.activeElement!!.tagName) as string;
    assert.equal(tagName.toLowerCase(), 'input');
  });

  it('should open a link to new tab by F', async () => {
    let page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}/`);
    await page.sendKeys(Key.SHIFT, 'f');
    await page.waitAndGetHints();
    await page.sendKeys('a');

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.equal(tabs.length, 2);
      assert.equal(new URL(tabs[1].url).pathname, '/hello');
      assert.equal(tabs[1].openerTabId, tabs[0].id);
    });
  });

  it('should show hints of links in area', async () => {
    let page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}/area`);
    await page.sendKeys(Key.SHIFT, 'f');

    let hints = await page.waitAndGetHints();
    assert.equal(hints.length, 3);
  });

  it('should shows hints only in viewport', async () => {
    let page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}/test1`);
    await page.sendKeys(Key.SHIFT, 'f');

    let hints = await page.waitAndGetHints();
    assert.equal(hints.length, 1);
  });

  it('should shows hints only in window of the frame', async () => {
    let page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}/test2`);
    await page.sendKeys(Key.SHIFT, 'f');

    await webdriver.switchTo().frame(0);
    let hints = await page.waitAndGetHints();
    assert.equal(hints.length, 1);
  });

  it('should shows hints only in the frame', async () => {
    let page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}/test3`);
    await page.sendKeys(Key.SHIFT, 'f');

    await webdriver.switchTo().frame(0);
    let hints = await page.waitAndGetHints();
    assert.equal(hints.length, 1);
  });
});
