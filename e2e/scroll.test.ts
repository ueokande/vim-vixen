import express from 'express';
import * as path from 'path';
import * as assert from 'assert';
import * as http from 'http';

import { Builder, Lanthan } from 'lanthan';
import { WebDriver, WebElement, By, Key } from 'selenium-webdriver';

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
  let body: WebElement;

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
    body = await webdriver.findElement(By.css('body'));
  });


  it('scrolls up by k', async () => {
    await body.sendKeys('j');

    let pageYOffset = await webdriver.executeScript(() => window.pageYOffset) as number;
    assert.equal(pageYOffset, 64);
  });

  it('scrolls down by j', async () => {
    await webdriver.executeScript(() => window.scrollTo(0, 200));
    await body.sendKeys('k');

    let pageYOffset = await webdriver.executeScript(() => window.pageYOffset) as number;
    assert.equal(pageYOffset, 136);
  });

  it('scrolls left by h', async () => {
    await webdriver.executeScript(() => window.scrollTo(100, 100));
    await body.sendKeys('h');

    let pageXOffset = await webdriver.executeScript(() => window.pageXOffset) as number;
    assert.equal(pageXOffset, 36);
  });

  it('scrolls left by l', async () => {
    await webdriver.executeScript(() => window.scrollTo(100, 100));
    await body.sendKeys('l');

    let pageXOffset = await webdriver.executeScript(() => window.pageXOffset) as number;
    assert.equal(pageXOffset, 164);
  });

  it('scrolls top by gg', async () => {
    await webdriver.executeScript(() => window.scrollTo(0, 100));
    await body.sendKeys('g', 'g');

    let pageYOffset = await webdriver.executeScript(() => window.pageYOffset) as number;
    assert.equal(pageYOffset, 0);
  });

  it('scrolls bottom by G', async () => {
    await webdriver.executeScript(() => window.scrollTo(0, 100));
    await body.sendKeys(Key.SHIFT, 'g');

    let pageYOffset = await webdriver.executeScript(() => window.pageYOffset) as number;
    assert.ok(pageYOffset > 5000);
  });

  it('scrolls bottom by 0', async () => {
    await webdriver.executeScript(() => window.scrollTo(0, 100));
    await body.sendKeys(Key.SHIFT, '0');

    let pageXOffset = await webdriver.executeScript(() => window.pageXOffset) as number;
    assert.ok(pageXOffset === 0);
  });

  it('scrolls bottom by $', async () => {
    await webdriver.executeScript(() => window.scrollTo(0, 100));
    await body.sendKeys(Key.SHIFT, '$');

    let pageXOffset = await webdriver.executeScript(() => window.pageXOffset) as number;
    assert.ok(pageXOffset > 5000);
  });

  it('scrolls bottom by <C-U>', async () => {
    await webdriver.executeScript(() => window.scrollTo(0, 1000));
    await body.sendKeys(Key.CONTROL, 'u');

    let pageHeight = 
      await webdriver.executeScript(() => window.document.documentElement.clientHeight) as number;
    let pageYOffset = await webdriver.executeScript(() => window.pageYOffset) as number;
    assert.ok(Math.abs(pageYOffset - (1000 - Math.floor(pageHeight / 2))) < 5);
  });

  it('scrolls bottom by <C-D>', async () => {
    await webdriver.executeScript(() => window.scrollTo(0, 1000));
    await body.sendKeys(Key.CONTROL, 'd');

    let pageHeight = 
      await webdriver.executeScript(() => window.document.documentElement.clientHeight) as number;
    let pageYOffset = await webdriver.executeScript(() => window.pageYOffset) as number;
    assert.ok(Math.abs(pageYOffset - (1000 + Math.floor(pageHeight / 2))) < 5);
  });

  it('scrolls bottom by <C-B>', async () => {
    await webdriver.executeScript(() => window.scrollTo(0, 1000));
    await body.sendKeys(Key.CONTROL, 'b');

    let pageHeight = 
      await webdriver.executeScript(() => window.document.documentElement.clientHeight) as number;
    let pageYOffset = await webdriver.executeScript(() => window.pageYOffset) as number;
    assert.ok(Math.abs(pageYOffset - (1000 - pageHeight)) < 5);
  });

  it('scrolls bottom by <C-F>', async () => {
    await webdriver.executeScript(() => window.scrollTo(0, 1000));
    await body.sendKeys(Key.CONTROL, 'f');

    let pageHeight = 
      await webdriver.executeScript(() => window.document.documentElement.clientHeight) as number;
    let pageYOffset = await webdriver.executeScript(() => window.pageYOffset) as number;
    assert.ok(Math.abs(pageYOffset - (1000 + pageHeight)) < 5);
  });
});
