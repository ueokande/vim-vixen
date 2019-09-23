import express from 'express';
import * as path from 'path';
import * as assert from 'assert';
import * as http from 'http';

import { Builder, Lanthan } from 'lanthan';
import { WebDriver, Key } from 'selenium-webdriver';
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

describe("scroll test", () => {
  const port = 12321;
  let http: http.Server;
  let lanthan: Lanthan;
  let webdriver: WebDriver;
  let page: Page;

  before(async() => {
    http = newApp().listen(port);

    lanthan = await Builder
      .forBrowser('firefox')
      .spyAddon(path.join(__dirname, '..'))
      .build();
    webdriver = lanthan.getWebDriver();
  });

  after(async() => {
    if (lanthan) {
      await lanthan.quit();
    }
    if (http) {
      http.close();
    }
  });

  beforeEach(async() => {
    await webdriver.navigate().to(`http://127.0.0.1:${port}`);
    page = await Page.currentContext(webdriver);
  });


  it('scrolls up by k', async () => {
    await page.sendKeys('j');

    let scrollY = await page.getScrollY();
    assert.equal(scrollY, 64);
  });

  it('scrolls down by j', async () => {
    await webdriver.executeScript(() => window.scrollTo(0, 200));
    await page.sendKeys('k');

    let scrollY = await page.getScrollY();
    assert.equal(scrollY, 136);
  });

  it('scrolls left by h', async () => {
    await webdriver.executeScript(() => window.scrollTo(100, 100));
    await page.sendKeys('h');

    let pageXOffset = await webdriver.executeScript(() => window.pageXOffset) as number;
    assert.equal(pageXOffset, 36);
  });

  it('scrolls left by l', async () => {
    await webdriver.executeScript(() => window.scrollTo(100, 100));
    await page.sendKeys('l');

    let pageXOffset = await webdriver.executeScript(() => window.pageXOffset) as number;
    assert.equal(pageXOffset, 164);
  });

  it('scrolls top by gg', async () => {
    await webdriver.executeScript(() => window.scrollTo(0, 100));
    await page.sendKeys('g', 'g');

    let scrollY = await page.getScrollY();
    assert.equal(scrollY, 0);
  });

  it('scrolls bottom by G', async () => {
    await webdriver.executeScript(() => window.scrollTo(0, 100));
    await page.sendKeys(Key.SHIFT, 'g');

    let scrollY = await page.getScrollY();
    assert.ok(scrollY > 5000);
  });

  it('scrolls bottom by 0', async () => {
    await webdriver.executeScript(() => window.scrollTo(0, 100));
    await page.sendKeys(Key.SHIFT, '0');

    let pageXOffset = await webdriver.executeScript(() => window.pageXOffset) as number;
    assert.ok(pageXOffset === 0);
  });

  it('scrolls bottom by $', async () => {
    await webdriver.executeScript(() => window.scrollTo(0, 100));
    await page.sendKeys(Key.SHIFT, '$');

    let pageXOffset = await webdriver.executeScript(() => window.pageXOffset) as number;
    assert.ok(pageXOffset > 5000);
  });

  it('scrolls bottom by <C-U>', async () => {
    await webdriver.executeScript(() => window.scrollTo(0, 1000));
    await page.sendKeys(Key.CONTROL, 'u');

    let pageHeight = await page.pageHeight();
    let scrollY = await page.getScrollY();
    assert.ok(Math.abs(scrollY - (1000 - Math.floor(pageHeight / 2))) < 5);
  });

  it('scrolls bottom by <C-D>', async () => {
    await webdriver.executeScript(() => window.scrollTo(0, 1000));
    await page.sendKeys(Key.CONTROL, 'd');

    let pageHeight = await page.pageHeight();
    let scrollY = await page.getScrollY();
    assert.ok(Math.abs(scrollY - (1000 + Math.floor(pageHeight / 2))) < 5);
  });

  it('scrolls bottom by <C-B>', async () => {
    await webdriver.executeScript(() => window.scrollTo(0, 1000));
    await page.sendKeys(Key.CONTROL, 'b');

    let pageHeight = await page.pageHeight();
    let scrollY = await page.getScrollY();
    assert.ok(Math.abs(scrollY - (1000 - pageHeight)) < 5);
  });

  it('scrolls bottom by <C-F>', async () => {
    await webdriver.executeScript(() => window.scrollTo(0, 1000));
    await page.sendKeys(Key.CONTROL, 'f');

    let pageHeight = await page.pageHeight();
    let scrollY = await page.getScrollY();
    assert.ok(Math.abs(scrollY - (1000 + pageHeight)) < 5);
  });
});
