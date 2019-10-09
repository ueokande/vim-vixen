import * as path from 'path';
import * as assert from 'assert';

import TestServer from './lib/TestServer';
import eventually from './eventually';
import { Builder, Lanthan } from 'lanthan';
import { WebDriver, Key } from 'selenium-webdriver';
import Page from './lib/Page';

const newApp = () => {
  let server = new TestServer();

  server.receiveContent('/', `
    <!DOCTYPE html>
    <html lang="en"><body>
      <a href="hello">hello</a>
    </body></html>`);

  server.receiveContent('/follow-input', `
    <!DOCTYPE html>
    <html lang="en"><body>
      <input>
    </body></html>`);

  server.receiveContent('/area', `
    <!DOCTYPE html>
    <html lang="en"><body>
      <img
        width="256" height="256"  usemap="#map"
        src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
      >
      <map name="map">
        <area shape="rect" coords="0,0,64,64" href="/">
        <area shape="rect" coords="64,64,64,64" href="/">
        <area shape="rect" coords="128,128,64,64" href="/">
      </map>
    </body></html>`);

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
  server.receiveContent('/test1', `
    <!DOCTYPE html>
    <html lang="en"><body>
      <div><a href="link1">link1</a></div>
      <div style="min-height:3000px"></div>
      <div><a href="link2">link2</a></div>
    </body></html>`);

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
  server.receiveContent('/test2', `
    <!DOCTYPE html>
    <html lang="en"><body>
      <iframe height="5000" src='/test2-frame'>
    </body></html>`);
  server.receiveContent('/test2-frame', `
    <!DOCTYPE html>
    <html lang="en"><body>
      <div><a href="link1">link1</a></div>
      <div style="min-height:3000px"></div>
      <div><a href="link2">link2</a></div>
    </body></html>`);

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
  server.receiveContent('/test3', `
    <!DOCTYPE html>
    <html lang="en"><body>
      <iframe src='/test3-frame'>
    </body></html>`);
  server.receiveContent('/test3-frame', `
    <!DOCTYPE html>
    <html lang="en"><body>
      <div><a href="link1">link1</a></div>
      <div style="min-height:3000px"></div>
      <div><a href="link2">link2</a></div>
    </body></html>`);

  return server;
};

describe('follow test', () => {
  let server = newApp();
  let lanthan: Lanthan;
  let webdriver: WebDriver;
  let browser: any;

  before(async() => {
    lanthan = await Builder
      .forBrowser('firefox')
      .spyAddon(path.join(__dirname, '..'))
      .build();
    webdriver = lanthan.getWebDriver();
    browser = lanthan.getWebExtBrowser();
    await server.start();
  });

  after(async() => {
    await server.stop();
    if (lanthan) {
      await lanthan.quit();
    }
  });

  afterEach(async() => {
    let tabs = await browser.tabs.query({});
    for (let tab of tabs.slice(1)) {
      await browser.tabs.remove(tab.id);
    }
  });

  it('should focus an input by f', async () => {
    let page = await Page.navigateTo(webdriver, server.url('/follow-input'));
    await page.sendKeys('f');
    await page.waitAndGetHints();
    await page.sendKeys('a');

    let tagName = await webdriver.executeScript(() => document.activeElement!!.tagName) as string;
    assert.strictEqual(tagName.toLowerCase(), 'input');
  });

  it('should open a link by f', async () => {
    let page = await Page.navigateTo(webdriver, server.url());
    await page.sendKeys('f');
    await page.waitAndGetHints();
    await page.sendKeys('a');

    await eventually(async() => {
      let hash = await webdriver.executeScript('return location.pathname');
      assert.strictEqual(hash, '/hello');
    });
  });

  it('should focus an input by F', async () => {
    let page = await Page.navigateTo(webdriver, server.url('/follow-input'));
    await page.sendKeys(Key.SHIFT, 'f');
    await page.waitAndGetHints();
    await page.sendKeys('a');

    let tagName = await webdriver.executeScript(() => document.activeElement!!.tagName) as string;
    assert.strictEqual(tagName.toLowerCase(), 'input');
  });

  it('should open a link to new tab by F', async () => {
    let page = await Page.navigateTo(webdriver, server.url());
    await page.sendKeys(Key.SHIFT, 'f');
    await page.waitAndGetHints();
    await page.sendKeys('a');

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.strictEqual(tabs.length, 2);
      assert.strictEqual(new URL(tabs[1].url).pathname, '/hello');
      assert.strictEqual(tabs[1].openerTabId, tabs[0].id);
    });
  });

  it('should show hints of links in area', async () => {
    let page = await Page.navigateTo(webdriver, server.url('/area'));
    await page.sendKeys(Key.SHIFT, 'f');

    let hints = await page.waitAndGetHints();
    assert.strictEqual(hints.length, 3);
  });

  it('should shows hints only in viewport', async () => {
    let page = await Page.navigateTo(webdriver, server.url('/test1'));
    await page.sendKeys(Key.SHIFT, 'f');

    let hints = await page.waitAndGetHints();
    assert.strictEqual(hints.length, 1);
  });

  it('should shows hints only in window of the frame', async () => {
    let page = await Page.navigateTo(webdriver, server.url('/test2'));
    await page.sendKeys(Key.SHIFT, 'f');

    await webdriver.switchTo().frame(0);
    let hints = await page.waitAndGetHints();
    assert.strictEqual(hints.length, 1);
  });

  it('should shows hints only in the frame', async () => {
    let page = await Page.navigateTo(webdriver, server.url('/test3'));
    await page.sendKeys(Key.SHIFT, 'f');

    await webdriver.switchTo().frame(0);
    let hints = await page.waitAndGetHints();
    assert.strictEqual(hints.length, 1);
  });
});
