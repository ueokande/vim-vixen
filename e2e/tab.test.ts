import express from 'express';
import * as path from 'path';
import * as assert from 'assert';
import * as http from 'http';

import eventually from './eventually';
import { Builder, Lanthan } from 'lanthan';
import { WebDriver, By, Key } from 'selenium-webdriver';

const newApp = () => {
  let app = express();
  app.get('/', (_req, res) => {
    res.send('ok');
  });
  return app;
};

describe("tab test", () => {
  const port = 12321;
  const url = `http://127.0.0.1:${port}/`;

  let http: http.Server;
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
    http = newApp().listen(port);
  });

  after(async() => {
    if (http) {
      http.close();
    }
    if (lanthan) {
      await lanthan.quit();
    }
  });

  beforeEach(async() => {
    win = await browser.windows.create({ url: `${url}#0` });
    for (let i = 1; i < 5; ++i) {
      await browser.tabs.create({ url: `${url}#${i}`, windowId: win.id });
      await webdriver.navigate().to(`${url}#${i}`);
    }
    tabs = await browser.tabs.query({ windowId: win.id });
    tabs.sort((t1: any, t2: any) => t1.index - t2.index);
  });

  afterEach(async() => {
    await browser.windows.remove(win.id);
  });

  it('deletes tab and selects right by d', async () => {
    await browser.tabs.update(tabs[3].id, { active: true });
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys('d');

    let current = await browser.tabs.query({ windowId: win.id });
    assert.ok(current.length === tabs.length - 1);
    assert.ok(current[3].active);
    assert.ok(current[3].url === tabs[4].url);
  });

  it('deletes tab and selects left by D', async () => {
    await browser.tabs.update(tabs[3].id, { active: true });
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(Key.SHIFT, 'D');

    await eventually(async() => {
      let current = await browser.tabs.query({ windowId: win.id });
      assert.ok(current.length === tabs.length - 1);
      assert.ok(current[2].active);
      assert.ok(current[2].url === tabs[2].url);
    })
  });

  it('deletes all tabs to the right by x$', async () => {
    await browser.tabs.update(tabs[1].id, { active: true });
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys('x', '$');

    let current = await browser.tabs.query({ windowId: win.id });
    assert.ok(current.length === 2);
  });

  it('duplicates tab by zd', async () => {
    await browser.tabs.update(tabs[0].id, { active: true });
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys('z', 'd');

    await eventually(async() => {
      let current = await browser.tabs.query({ windowId: win.id });
      current.sort((t1: any, t2: any) => t1.index - t2.index);
      assert.ok(current.length === tabs.length + 1);
      assert.ok(current[0].url === current[1].url);
    });
  });

  it('makes pinned by zp', async () => {
    await browser.tabs.update(tabs[0].id, { active: true });
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys('z', 'p');

    let current = await browser.tabs.query({ windowId: win.id });
    assert.ok(current[0].pinned);
  });

  it('selects previous tab by K', async () => {
    await browser.tabs.update(tabs[2].id, { active: true });
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(Key.SHIFT, 'K');

    let current = await browser.tabs.query({ windowId: win.id });
    assert.ok(current[1].active);
  });

  it('selects previous tab by K rotatory', async () => {
    await browser.tabs.update(tabs[0].id, { active: true });
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(Key.SHIFT, 'K');

    let current = await browser.tabs.query({ windowId: win.id });
    assert.ok(current[current.length - 1].active)
  });

  it('selects next tab by J', async () => {
    await browser.tabs.update(tabs[2].id, { active: true });
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(Key.SHIFT, 'J');

    let current = await browser.tabs.query({ windowId: win.id });
    assert.ok(current[3].active);
  });

  it('selects previous tab by J rotatory', async () => {
    await browser.tabs.update(tabs[tabs.length - 1].id, { active: true });
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(Key.SHIFT, 'J');

    let current = await browser.tabs.query({ windowId: win.id });
    assert.ok(current[0].active)
  });

  it('selects first tab by g0', async () => {
    await browser.tabs.update(tabs[2].id, { active: true });
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys('g', '0');

    let current = await browser.tabs.query({ windowId: win.id });
    assert.ok(current[0].active)
  });

  it('selects last tab by g$', async () => {
    await browser.tabs.update(tabs[2].id, { active: true });
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys('g', '$');

    let current = await browser.tabs.query({ windowId: win.id });
    assert.ok(current[current.length - 1].active)
  });

  it('selects last selected tab by <C-6>', async () => {
    await browser.tabs.update(tabs[1].id, { active: true });
    await browser.tabs.update(tabs[4].id, { active: true });

    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(Key.CONTROL, '6');

    let current = await browser.tabs.query({ windowId: win.id });
    assert.ok(current[1].active)
  });

  // browser.sessions.getRecentlyClosed() sometime throws "An unexpected error occurred"
  // This might be a bug in Firefox.
  it.skip('reopen tab by u', async () => {
    await browser.tabs.remove(tabs[1].id);
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys('u');

    let current = await browser.tabs.query({ windowId: win.id });
    assert.ok(current.length === tabs.length);
  });

  it('does not delete pinned tab by d', async () => {
    await browser.tabs.update(tabs[0].id, { active: true, pinned: true });
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys('d');

    let current = await browser.tabs.query({ windowId: win.id });
    assert.ok(current.length === tabs.length);
  });

  it('deletes pinned tab by !d', async () => {
    await browser.tabs.update(tabs[0].id, { active: true, pinned: true });
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys('!', 'd');

    let current = await browser.tabs.query({ windowId: win.id });
    assert.ok(current.length === tabs.length - 1);
  });

  it('opens view-source by gf', async () => {
    await browser.tabs.update(tabs[0].id, { active: true });
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys('g', 'f');

    await eventually(async() => {
      let current = await browser.tabs.query({ windowId: win.id });
      assert.ok(current.length === tabs.length + 1);
      assert.ok(current[current.length - 1].url === `view-source:${url}#0`);
    });
  });
});
