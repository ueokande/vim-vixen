import * as path from 'path';
import * as assert from 'assert';

import TestServer from './lib/TestServer';
import { Builder, Lanthan } from 'lanthan';
import { WebDriver, Key } from 'selenium-webdriver';
import Page from './lib/Page';

describe("scroll test", () => {
  const server = new TestServer().receiveContent('/',
    `<!DOCTYPE html><html lang="en"><body style="width:10000px; height:10000px"></body></html>`,
  );
  let lanthan: Lanthan;
  let webdriver: WebDriver;
  let page: Page;

  before(async() => {
    lanthan = await Builder
      .forBrowser('firefox')
      .spyAddon(path.join(__dirname, '..'))
      .build();
    webdriver = lanthan.getWebDriver();
    await server.start();
  });

  after(async() => {
    await server.stop();
    if (lanthan) {
      await lanthan.quit();
    }
  });

  beforeEach(async() => {
    await webdriver.navigate().to(server.url());
    page = await Page.currentContext(webdriver);
  });


  it('scrolls up by j', async () => {
    await page.sendKeys('j');

    const scrollY = await page.getScrollY();
    assert.strictEqual(scrollY, 64);
  });

  it('scrolls down by k', async () => {
    await webdriver.executeScript(() => window.scrollTo(0, 200));
    await page.sendKeys('k');

    const scrollY = await page.getScrollY();
    assert.strictEqual(scrollY, 136);
  });

  it('scrolls left by h', async () => {
    await webdriver.executeScript(() => window.scrollTo(100, 100));
    await page.sendKeys('h');

    const pageXOffset = await webdriver.executeScript(() => window.pageXOffset) as number;
    assert.strictEqual(pageXOffset, 36);
  });

  it('scrolls left by l', async () => {
    await webdriver.executeScript(() => window.scrollTo(100, 100));
    await page.sendKeys('l');

    const pageXOffset = await webdriver.executeScript(() => window.pageXOffset) as number;
    assert.strictEqual(pageXOffset, 164);
  });

  it('scrolls top by gg', async () => {
    await webdriver.executeScript(() => window.scrollTo(0, 100));
    await page.sendKeys('g', 'g');

    const scrollY = await page.getScrollY();
    assert.strictEqual(scrollY, 0);
  });

  it('scrolls bottom by G', async () => {
    await webdriver.executeScript(() => window.scrollTo(0, 100));
    await page.sendKeys(Key.SHIFT, 'g');

    const scrollY = await page.getScrollY();
    assert.ok(scrollY > 5000);
  });

  it('scrolls bottom by 0', async () => {
    await webdriver.executeScript(() => window.scrollTo(0, 100));
    await page.sendKeys(Key.SHIFT, '0');

    const pageXOffset = await webdriver.executeScript(() => window.pageXOffset) as number;
    assert.ok(pageXOffset === 0);
  });

  it('scrolls bottom by $', async () => {
    await webdriver.executeScript(() => window.scrollTo(0, 100));
    await page.sendKeys(Key.SHIFT, '$');

    const pageXOffset = await webdriver.executeScript(() => window.pageXOffset) as number;
    assert.ok(pageXOffset > 5000);
  });

  it('scrolls bottom by <C-U>', async () => {
    await webdriver.executeScript(() => window.scrollTo(0, 1000));
    await page.sendKeys(Key.CONTROL, 'u');

    const pageHeight = await page.pageHeight();
    const scrollY = await page.getScrollY();
    assert.ok(Math.abs(scrollY - (1000 - Math.floor(pageHeight / 2))) < 5);
  });

  it('scrolls bottom by <C-D>', async () => {
    await webdriver.executeScript(() => window.scrollTo(0, 1000));
    await page.sendKeys(Key.CONTROL, 'd');

    const pageHeight = await page.pageHeight();
    const scrollY = await page.getScrollY();
    assert.ok(Math.abs(scrollY - (1000 + Math.floor(pageHeight / 2))) < 5);
  });

  it('scrolls bottom by <C-B>', async () => {
    await webdriver.executeScript(() => window.scrollTo(0, 1000));
    await page.sendKeys(Key.CONTROL, 'b');

    const pageHeight = await page.pageHeight();
    const scrollY = await page.getScrollY();
    assert.ok(Math.abs(scrollY - (1000 - pageHeight)) < 5);
  });

  it('scrolls bottom by <C-F>', async () => {
    await webdriver.executeScript(() => window.scrollTo(0, 1000));
    await page.sendKeys(Key.CONTROL, 'f');

    const pageHeight = await page.pageHeight();
    const scrollY = await page.getScrollY();
    assert.ok(Math.abs(scrollY - (1000 + pageHeight)) < 5);
  });
});
