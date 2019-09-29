import * as path from 'path';
import * as assert from 'assert';

import TestServer from './lib/TestServer';
import eventually from './eventually';
import { Builder, Lanthan } from 'lanthan';
import { WebDriver, Key } from 'selenium-webdriver';
import Page from './lib/Page';

describe("tab test", () => {
  let server = new TestServer().receiveContent('/*', 'ok');
  let lanthan: Lanthan;
  let webdriver: WebDriver;
  let browser: any;
  let win: any;
  let tabs: any[];

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

  beforeEach(async() => {
    win = await browser.windows.create({ url: server.url('/#0') });
    for (let i = 1; i < 5; ++i) {
      await browser.tabs.create({ url: server.url('/#' + i), windowId: win.id });
      await webdriver.navigate().to(server.url('/#' + i));
    }
    tabs = await browser.tabs.query({ windowId: win.id });
    tabs.sort((t1: any, t2: any) => t1.index - t2.index);
  });

  afterEach(async() => {
    await browser.windows.remove(win.id);
  });

  it('deletes tab and selects right by d', async () => {
    await browser.tabs.update(tabs[3].id, { active: true });
    let page = await Page.currentContext(webdriver);
    await page.sendKeys('d');

    await eventually(async() => {
      let current = await browser.tabs.query({ windowId: win.id });
      assert.strictEqual(current.length, tabs.length - 1);
      assert.strictEqual(current[3].active, true);
      assert.strictEqual(current[3].id, tabs[4].id);
    });
  });

  it('deletes tab and selects left by D', async () => {
    await browser.tabs.update(tabs[3].id, { active: true });
    let page = await Page.currentContext(webdriver);
    await page.sendKeys(Key.SHIFT, 'D');

    await eventually(async() => {
      let current = await browser.tabs.query({ windowId: win.id });
      assert.strictEqual(current.length, tabs.length - 1);
      assert.strictEqual(current[2].active, true);
      assert.strictEqual(current[2].id, tabs[2].id);
    })
  });

  it('deletes all tabs to the right by x$', async () => {
    await browser.tabs.update(tabs[1].id, { active: true });
    let page = await Page.currentContext(webdriver);
    await page.sendKeys('x', '$');

    let current = await browser.tabs.query({ windowId: win.id });
    assert.strictEqual(current.length, 2);
  });

  it('duplicates tab by zd', async () => {
    await browser.tabs.update(tabs[0].id, { active: true });
    let page = await Page.currentContext(webdriver);
    await page.sendKeys('z', 'd');

    await eventually(async() => {
      let current = await browser.tabs.query({ windowId: win.id });
      current.sort((t1: any, t2: any) => t1.index - t2.index);
      assert.strictEqual(current.length, tabs.length + 1);
      assert.strictEqual(current[0].url, current[1].url);
    });
  });

  it('makes pinned by zp', async () => {
    await browser.tabs.update(tabs[0].id, { active: true });
    let page = await Page.currentContext(webdriver);
    await page.sendKeys('z', 'p');

    let current = await browser.tabs.query({ windowId: win.id });
    assert.strictEqual(current[0].pinned, true);
  });

  it('selects previous tab by K', async () => {
    await browser.tabs.update(tabs[2].id, { active: true });
    let page = await Page.currentContext(webdriver);
    await page.sendKeys(Key.SHIFT, 'K');

    let current = await browser.tabs.query({ windowId: win.id });
    assert.strictEqual(current[1].active, true);
  });

  it('selects previous tab by K rotatory', async () => {
    await browser.tabs.update(tabs[0].id, { active: true });
    let page = await Page.currentContext(webdriver);
    await page.sendKeys(Key.SHIFT, 'K');

    let current = await browser.tabs.query({ windowId: win.id });
    assert.strictEqual(current[current.length - 1].active, true)
  });

  it('selects next tab by J', async () => {
    await browser.tabs.update(tabs[2].id, { active: true });
    let page = await Page.currentContext(webdriver);
    await page.sendKeys(Key.SHIFT, 'J');

    let current = await browser.tabs.query({ windowId: win.id });
    assert.strictEqual(current[3].active, true);
  });

  it('selects previous tab by J rotatory', async () => {
    await browser.tabs.update(tabs[tabs.length - 1].id, { active: true });
    let page = await Page.currentContext(webdriver);
    await page.sendKeys(Key.SHIFT, 'J');

    let current = await browser.tabs.query({ windowId: win.id });
    assert.strictEqual(current[0].active, true)
  });

  it('selects first tab by g0', async () => {
    await browser.tabs.update(tabs[2].id, { active: true });
    let page = await Page.currentContext(webdriver);
    await page.sendKeys('g', '0');

    let current = await browser.tabs.query({ windowId: win.id });
    assert.strictEqual(current[0].active, true)
  });

  it('selects last tab by g$', async () => {
    await browser.tabs.update(tabs[2].id, { active: true });
    let page = await Page.currentContext(webdriver);
    await page.sendKeys('g', '$');

    let current = await browser.tabs.query({ windowId: win.id });
    assert.strictEqual(current[current.length - 1].active, true)
  });

  it('selects last selected tab by <C-6>', async () => {
    await browser.tabs.update(tabs[1].id, { active: true });
    await browser.tabs.update(tabs[4].id, { active: true });

    let page = await Page.currentContext(webdriver);
    await page.sendKeys(Key.CONTROL, '6');

    let current = await browser.tabs.query({ windowId: win.id });
    assert.strictEqual(current[1].active, true)
  });

  // browser.sessions.getRecentlyClosed() sometime throws "An unexpected error occurred"
  // This might be a bug in Firefox.
  it.skip('reopen tab by u', async () => {
    await browser.tabs.remove(tabs[1].id);
    let page = await Page.currentContext(webdriver);
    await page.sendKeys('u');

    let current = await browser.tabs.query({ windowId: win.id });
    assert.strictEqual(current.length, tabs.length);
  });

  it('does not delete pinned tab by d', async () => {
    await browser.tabs.update(tabs[0].id, { active: true, pinned: true });
    let page = await Page.currentContext(webdriver);
    await page.sendKeys('d');

    let current = await browser.tabs.query({ windowId: win.id });
    assert.strictEqual(current.length, tabs.length);
  });

  it('deletes pinned tab by !d', async () => {
    await browser.tabs.update(tabs[0].id, { active: true, pinned: true });
    let page = await Page.currentContext(webdriver);
    await page.sendKeys('!', 'd');

    let current = await browser.tabs.query({ windowId: win.id });
    assert.strictEqual(current.length, tabs.length - 1);
  });

  it('opens view-source by gf', async () => {
    await browser.tabs.update(tabs[0].id, { active: true });
    let page = await Page.currentContext(webdriver);
    await page.sendKeys('g', 'f');

    await eventually(async() => {
      let current = await browser.tabs.query({ windowId: win.id });
      assert.strictEqual(current.length, tabs.length + 1);
      assert.strictEqual(current[current.length - 1].url, `view-source:${server.url('/#0')}`);
    });
  });
});
