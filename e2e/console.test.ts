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
  <head>
    <title>Hello, world!</title>
  </head>
</html">`);
  });
  return app;
};


describe("console test", () => {
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
    page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}`);
  });

  it('open console with :', async() => {
    await page.sendKeys(':');
    let console = await page.getConsole();
    assert.equal(await console.currentValue(), '');
  });

  it('open console with open command by o', async() => {
    await page.sendKeys('o');
    let console = await page.getConsole();
    assert.equal(await console.currentValue(), 'open ');
  });

  it('open console with open command and current URL by O', async() => {
    await page.sendKeys(Key.SHIFT, 'o');
    let console = await page.getConsole();
    assert.equal(await console.currentValue(), `open http://127.0.0.1:${port}/`);
  });

  it('open console with tabopen command by t', async() => {
    await page.sendKeys('t');
    let console = await page.getConsole();
    assert.equal(await console.currentValue(), 'tabopen ');
  });

  it('open console with tabopen command and current URL by T', async() => {
    await page.sendKeys(Key.SHIFT, 't');
    let console = await page.getConsole();
    assert.equal(await console.currentValue(), `tabopen http://127.0.0.1:${port}/`);
  });

  it('open console with winopen command by w', async() => {
    await page.sendKeys('w');
    let console = await page.getConsole();
    assert.equal(await console.currentValue(), `winopen `);
  });

  it('open console with winopen command and current URL by W', async() => {
    await page.sendKeys(Key.SHIFT, 'W');
    let console = await page.getConsole();
    assert.equal(await console.currentValue(), `winopen http://127.0.0.1:${port}/`);
  });

  it('open console with buffer command by b', async() => {
    await page.sendKeys('b');
    let console = await page.getConsole();
    assert.equal(await console.currentValue(), `buffer `);
  });

  it('open console with addbookmark command with title by a', async() => {
    await page.sendKeys('a');
    let console = await page.getConsole();
    assert.equal(await console.currentValue(), `addbookmark Hello, world!`);
  });
});
