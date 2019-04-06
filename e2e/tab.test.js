const express = require('express');
const lanthan = require('lanthan');
const path = require('path');
const assert = require('assert');
const eventually = require('./eventually');

const Key = lanthan.Key;

const newApp = () => {
  let app = express();
  app.get('/', (req, res) => {
    res.send('ok');
  });
  return app;
};

describe("tab test", () => {

  const port = 12321;
  const url = `http://127.0.0.1:${port}/`;

  let http;
  let firefox;
  let session;
  let browser;
  let win;
  let tabs;

  before(async() => {
    firefox = await lanthan.firefox();
    await firefox.session.installAddon(path.join(__dirname, '..'));
    session = firefox.session;
    browser = firefox.browser;
    http = newApp().listen(port);
  });

  after(async() => {
    http.close();
    if (firefox) {
      await firefox.close();
    }
  });

  beforeEach(async() => {
    win = await browser.windows.create({ url: `${url}#0` });
    for (let i = 1; i < 5; ++i) {
      await browser.tabs.create({ url: `${url}#${i}`, windowId: win.id });
      await session.navigateTo(`${url}#${i}`);
    }
    tabs = await browser.tabs.query({ windowId: win.id });
    tabs.sort((t1, t2) => t1.index - t2.index);
  });

  afterEach(async() => {
    await browser.windows.remove(win.id);
  });

  it('deletes tab by d', async () => {
    let body = await session.findElementByCSS('body');
    await body.sendKeys('d');

    let current = await browser.tabs.query({ windowId: win.id });
    assert(current.length === tabs.length - 1);
  });

  it('deletes tabs to the right by D', async () => {
    await browser.tabs.update(tabs[1].id, { active: true });
    let body = await session.findElementByCSS('body');
    await body.sendKeys(Key.Shift, 'd');

    let current = await browser.tabs.query({ windowId: win.id });
    assert(current.length === 2);
  });

  it('duplicates tab by zd', async () => {
    await browser.tabs.update(tabs[0].id, { active: true });
    let body = await session.findElementByCSS('body');
    await body.sendKeys('z', 'd');

    await eventually(async() => {
      let current = await browser.tabs.query({ windowId: win.id });
      current.sort((t1, t2) => t1.index - t2.index);
      assert(current.length === tabs.length + 1);
      assert(current[0].url === current[1].url);
    });
  });

  it('makes pinned by zp', async () => {
    await browser.tabs.update(tabs[0].id, { active: true });
    let body = await session.findElementByCSS('body');
    await body.sendKeys('z', 'p');

    let current = await browser.tabs.query({ windowId: win.id });
    assert(current[0].pinned);
  });

  it('selects previous tab by K', async () => {
    await browser.tabs.update(tabs[2].id, { active: true });
    let body = await session.findElementByCSS('body');
    await body.sendKeys(Key.Shift, 'K');

    let current = await browser.tabs.query({ windowId: win.id });
    assert(current[1].active);
  });

  it('selects previous tab by K rotatory', async () => {
    await browser.tabs.update(tabs[0].id, { active: true });
    let body = await session.findElementByCSS('body');
    await body.sendKeys(Key.Shift, 'K');

    let current = await browser.tabs.query({ windowId: win.id });
    assert(current[current.length - 1].active)
  });

  it('selects next tab by J', async () => {
    await browser.tabs.update(tabs[2].id, { active: true });
    let body = await session.findElementByCSS('body');
    await body.sendKeys(Key.Shift, 'J');

    let current = await browser.tabs.query({ windowId: win.id });
    assert(current[3].active);
  });

  it('selects previous tab by J rotatory', async () => {
    await browser.tabs.update(tabs[tabs.length - 1].id, { active: true });
    let body = await session.findElementByCSS('body');
    await body.sendKeys(Key.Shift, 'J');

    let current = await browser.tabs.query({ windowId: win.id });
    assert(current[0].active)
  });

  it('selects first tab by g0', async () => {
    await browser.tabs.update(tabs[2].id, { active: true });
    let body = await session.findElementByCSS('body');
    await body.sendKeys('g', '0');

    let current = await browser.tabs.query({ windowId: win.id });
    assert(current[0].active)
  });

  it('selects last tab by g$', async () => {
    await browser.tabs.update(tabs[2].id, { active: true });
    let body = await session.findElementByCSS('body');
    await body.sendKeys('g', '$');

    let current = await browser.tabs.query({ windowId: win.id });
    assert(current[current.length - 1].active)
  });

  it('selects last selected tab by <C-6>', async () => {
    await browser.tabs.update(tabs[1].id, { active: true });
    await browser.tabs.update(tabs[4].id, { active: true });

    let body = await session.findElementByCSS('body');
    await body.sendKeys(Key.Control, '6');

    let current = await browser.tabs.query({ windowId: win.id });
    assert(current[1].active)
  });

  // browser.sessions.getRecentlyClosed() sometime throws "An unexpected error occurred"
  // This might be a bug in Firefox.
  it.skip('reopen tab by u', async () => {
    await browser.tabs.remove(tabs[1].id);
    let body = await session.findElementByCSS('body');
    await body.sendKeys('u');

    let current = await browser.tabs.query({ windowId: win.id });
    assert(current.length === tabs.length);
  });

  it('does not delete pinned tab by d', async () => {
    await browser.tabs.update(tabs[0].id, { active: true, pinned: true });
    let body = await session.findElementByCSS('body');
    await body.sendKeys('d');

    let current = await browser.tabs.query({ windowId: win.id });
    assert(current.length === tabs.length);
  });

  it('deletes pinned tab by !d', async () => {
    await browser.tabs.update(tabs[0].id, { active: true, pinned: true });
    let body = await session.findElementByCSS('body');
    await body.sendKeys('!', 'd');

    let current = await browser.tabs.query({ windowId: win.id });
    assert(current.length === tabs.length - 1);
  });

  it('opens view-source by gf', async () => {
    await browser.tabs.update(tabs[0].id, { active: true });
    let body = await session.findElementByCSS('body');
    await body.sendKeys('g', 'f');

    await eventually(async() => {
      let current = await browser.tabs.query({ windowId: win.id });
      assert(current.length === tabs.length + 1);
      assert(current[current.length - 1].url === `view-source:${url}#0`);
    });
  });
});
