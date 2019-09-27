import * as path from 'path';
import * as assert from 'assert';

import TestServer from './lib/TestServer';
import settings from './settings';
import eventually from './eventually';
import { Builder, Lanthan } from 'lanthan';
import { WebDriver } from 'selenium-webdriver';
import Page from './lib/Page';

describe("winopen command test", () => {
  let server = new TestServer(12321)
    .receiveContent('/google', 'google')
    .receiveContent('/yahoo', 'yahoo');
  let lanthan: Lanthan;
  let webdriver: WebDriver;
  let browser: any;
  let page: Page;

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

    await server.start();
  });

  after(async() => {
    await server.stop();
    if (lanthan) {
      await lanthan.quit();
    }
  });

  beforeEach(async() => {
    let wins = await browser.windows.getAll();
    for (let win of wins.slice(1)) {
      await browser.windows.remove(win.id);
    }

    page = await Page.navigateTo(webdriver, server.url());
  })

  it('should open default search for keywords by winopen command ', async() => {
    let console = await page.showConsole();
    await console.execCommand('winopen an apple');

    await eventually(async() => {
      let wins = await browser.windows.getAll();
      assert.equal(wins.length, 2);

      let tabs = await browser.tabs.query({ windowId: wins[1].id });
      let url = new URL(tabs[0].url);
      assert.equal(url.href, server.url('/google?q=an%20apple'))
    });
  });

  it('should open certain search page for keywords by winopen command ', async() => {
    let console = await page.showConsole();
    await console.execCommand('winopen yahoo an apple');

    await eventually(async() => {
      let wins = await browser.windows.getAll();
      assert.equal(wins.length, 2);

      let tabs = await browser.tabs.query({ windowId: wins[1].id });
      let url = new URL(tabs[0].url);
      assert.equal(url.href, server.url('/yahoo?q=an%20apple'))
    });
  });

  it('should open default engine with empty keywords by winopen command ', async() => {
    let console = await page.showConsole();
    await console.execCommand('winopen');

    await eventually(async() => {
      let wins = await browser.windows.getAll();
      assert.equal(wins.length, 2);

      let tabs = await browser.tabs.query({ windowId: wins[1].id });
      let url = new URL(tabs[0].url);
      assert.equal(url.href, server.url('/google?q='))
    });
  });

  it('should open certain search page for empty keywords by winopen command ', async() => {
    let console = await page.showConsole();
    await console.execCommand('winopen yahoo');

    await eventually(async() => {
      let wins = await browser.windows.getAll();
      assert.equal(wins.length, 2);

      let tabs = await browser.tabs.query({ windowId: wins[1].id });
      let url = new URL(tabs[0].url);
      assert.equal(url.href, server.url('/yahoo?q='))
    });
  });

  it('should open a site with domain by winopen command ', async() => {
    let console = await page.showConsole();
    await console.execCommand('winopen example.com');

    await eventually(async() => {
      let wins = await browser.windows.getAll();
      assert.equal(wins.length, 2);

      let tabs = await browser.tabs.query({ windowId: wins[1].id });
      let url = new URL(tabs[0].url);
      assert.equal(url.href, 'http://example.com/')
    });
  });

  it('should open a site with URL by winopen command ', async() => {
    let console = await page.showConsole();
    await console.execCommand('winopen https://example.com/');

    await eventually(async() => {
      let wins = await browser.windows.getAll();
      assert.equal(wins.length, 2);

      let tabs = await browser.tabs.query({ windowId: wins[1].id });
      let url = new URL(tabs[0].url);
      assert.equal(url.href, 'https://example.com/')
    });
  });
});
