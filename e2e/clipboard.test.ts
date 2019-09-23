import express from 'express';
import * as path from 'path';
import * as assert from 'assert';
import * as http from 'http';

import eventually from './eventually';
import * as clipboard from './lib/clipboard';
import settings from './settings';
import { Builder, Lanthan } from 'lanthan';
import { WebDriver, Key } from 'selenium-webdriver';
import Page from './lib/Page';

const newApp = () => {
  let app = express();
  app.get('/', (_req, res) => {
    res.status(200).send(`<html lang="en"></html">`);
  });
  return app;
};

describe("clipboard test", () => {
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

    await browser.storage.local.set({
      settings,
    });
  });

  after(async() => {
    if (lanthan) {
      await lanthan.quit();
    }
    http.close();
  });

  beforeEach(async() => {
    let tabs = await browser.tabs.query({});
    for (let tab of tabs.slice(1)) {
      await browser.tabs.remove(tab.id);
    }
  })

  it('should copy current URL by y', async () => {
    let page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}/#should_copy_url`);
    await page.sendKeys('y');

    await eventually(async() => {
      let data = await clipboard.read();
      assert.equal(data, `http://127.0.0.1:${port}/#should_copy_url`);
    });
  });

  it('should open an URL from clipboard by p', async () => {
    await clipboard.write(`http://127.0.0.1:${port}/#open_from_clipboard`);

    let page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}/`);
    await page.sendKeys('p');

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true });
      assert.equal(tabs[0].url, `http://127.0.0.1:${port}/#open_from_clipboard`);
    });
  });

  it('should open an URL from clipboard to new tab by P', async () => {
    await clipboard.write(`http://127.0.0.1:${port}/#open_to_new_tab`);

    let page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}/`);
    await page.sendKeys(Key.SHIFT, 'p');

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.deepEqual(tabs.map((t: any) => t.url), [
        `http://127.0.0.1:${port}/`,
        `http://127.0.0.1:${port}/#open_to_new_tab`,
      ]);
    });
  });

  it('should open search result with keywords in clipboard by p', async () => {
    await clipboard.write(`an apple`);

    let page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}/`);
    await page.sendKeys(Key.SHIFT, 'p');

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true });
      assert.equal(tabs[0].url, `http://127.0.0.1:${port}/google?q=an%20apple`);
    });
  });

  it('should open search result with keywords in clipboard to new tabby P', async () => {
    await clipboard.write(`an apple`);

    let page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}/`);
    await page.sendKeys(Key.SHIFT, 'p');

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.deepEqual(tabs.map((t: any) => t.url), [
        `http://127.0.0.1:${port}/`,
        `http://127.0.0.1:${port}/google?q=an%20apple`,
      ]);
    });
  });
});
