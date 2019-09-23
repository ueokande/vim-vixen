import express from 'express';
import * as path from 'path';
import * as assert from 'assert';
import * as http from 'http';

import settings from './settings';
import eventually from './eventually';
import { Builder, Lanthan } from 'lanthan';
import { WebDriver } from 'selenium-webdriver';
import Page from './lib/Page';

const newApp = () => {

  let app = express();
  for (let name of ['google', 'yahoo', 'bing', 'duckduckgo', 'twitter', 'wikipedia']) {
    app.get('/' + name, (_req, res) => {
      res.send(`<!DOCTYPEhtml>
<html lang="en">
  <body><h1>${name.charAt(0).toUpperCase() + name.slice(1)}</h1></body>
</html">`);
    });
  }
  app.get('/', (_req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <body><h1>home</h1></body>
</html">`);
  });
  return app;
};

describe("open command test", () => {
  const port = 12321;
  let http: http.Server;
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
    http = newApp().listen(port);

    await browser.storage.local.set({
      settings,
    });
  });

  after(async() => {
    http.close();
    if (lanthan) {
      await lanthan.quit();
    }
  });

  beforeEach(async() => {
    page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}`);
  })

  it('should open default search for keywords by open command ', async() => {
    let console = await page.showConsole();
    await console.execCommand('open an apple');

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true });
      let url = new URL(tabs[0].url);
      assert.equal(url.href, `http://127.0.0.1:${port}/google?q=an%20apple`)
    });
  });

  it('should open certain search page for keywords by open command ', async() => {
    let console = await page.showConsole();
    await console.execCommand('open yahoo an apple');

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true })
      let url = new URL(tabs[0].url);
      assert.equal(url.href, `http://127.0.0.1:${port}/yahoo?q=an%20apple`)
    });
  });

  it('should open default engine with empty keywords by open command ', async() => {
    let console = await page.showConsole();
    await console.execCommand('open');

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true })
      let url = new URL(tabs[0].url);
      assert.equal(url.href, `http://127.0.0.1:${port}/google?q=`)
    });
  });

  it('should open certain search page for empty keywords by open command ', async() => {
    let console = await page.showConsole();
    await console.execCommand('open yahoo');

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true })
      let url = new URL(tabs[0].url);
      assert.equal(url.href, `http://127.0.0.1:${port}/yahoo?q=`)
    });
  });

  it('should open a site with domain by open command ', async() => {
    let console = await page.showConsole();
    await console.execCommand('open example.com');

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true })
      let url = new URL(tabs[0].url);
      assert.equal(url.href, 'http://example.com/')
    });
  });

  it('should open a site with URL by open command ', async() => {
    let console = await page.showConsole();
    await console.execCommand('open https://example.com/');

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true })
      let url = new URL(tabs[0].url);
      assert.equal(url.href, 'https://example.com/')
    });
  });
});
