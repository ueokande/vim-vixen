import express from 'express';
import * as path from 'path';
import * as assert from 'assert';
import * as http from 'http';

import eventually from './eventually';
import { Builder, Lanthan } from 'lanthan';
import { WebDriver } from 'selenium-webdriver';
import Page from './lib/Page';

const newApp = () => {
  let app = express();
  app.get('/', (_req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <body style="width:10000px; height:10000px"></body>
</html">`);
  });
  return app;
};

describe("mark test", () => {
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

  it('should set a local mark and jump to it', async () => {
    let page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}`);
    await page.scrollTo(200, 200);
    await page.sendKeys('m', 'a');
    await page.scrollTo(500, 500);
    await page.sendKeys('\'', 'a');

    await eventually(async() => {
      assert.equal(await page.getScrollX(), 200);
      assert.equal(await page.getScrollY(), 200);
    });
  });

  it('should set a global mark and jump to it', async () => {
    let page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}#first`);
    await page.scrollTo(200, 200);
    await page.sendKeys('m', 'A');
    await page.scrollTo(500, 500);
    await page.sendKeys('\'', 'A');

    await eventually(async() => {
      assert.equal(await page.getScrollX(), 200);
      assert.equal(await page.getScrollY(), 200);
    });

    await browser.tabs.create({ url: `http://127.0.0.1:${port}#second` });
    page = await Page.currentContext(webdriver);
    await page.sendKeys('\'', 'A');

    await eventually(async() => {
      let tab = (await browser.tabs.query({ active: true }))[0];
      let url = new URL(tab.url);
      assert.equal(url.hash, '#first');

      assert.equal(await page.getScrollX(), 200);
      assert.equal(await page.getScrollY(), 200);
    });
  });

  it('set a global mark and creates new tab from gone', async () => {
    let page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}#first`);
    await page.scrollTo(500, 500);
    await page.sendKeys('m', 'A');

    let tab = (await browser.tabs.query({ active: true }))[0];
    await browser.tabs.create({ url: `http://127.0.0.1:${port}#second` });
    await browser.tabs.remove(tab.id);

    let handles: string[];
    await eventually(async() => {
      handles = await webdriver.getAllWindowHandles();
      assert.equal(handles.length, 2);
    });
    await webdriver.switchTo().window(handles!![0]);

    page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}#second`);
    await page.sendKeys('\'', 'A');

    await eventually(async() => {
      let tab = (await browser.tabs.query({ active: true }))[0];
      let url = new URL(tab.url);
      assert.equal(url.hash, '#first');
    });
  });
});


