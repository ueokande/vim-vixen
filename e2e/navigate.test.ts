import express from 'express';
import * as path from 'path';
import * as assert from 'assert';
import * as http from 'http';

import eventually from './eventually';
import { Builder, Lanthan } from 'lanthan';
import { WebDriver, Key } from 'selenium-webdriver';
import { Options as FirefoxOptions } from 'selenium-webdriver/firefox';
import Page from './lib/Page';

const newApp = () => {
  let app = express();
  app.get('/pagenation-a/:page', (req, res) => {
    res.status(200).send(`
<html lang="en">
  <a href="/pagenation-a/${Number(req.params.page) - 1}">prev</a>
  <a href="/pagenation-a/${Number(req.params.page) + 1}">next</a>
</html">`);
  });
  app.get('/pagenation-link/:page', (req, res) => {
    res.status(200).send(`
<html lang="en">
  <head>
    <link rel="prev" href="/pagenation-link/${Number(req.params.page) - 1}"></link>
    <link rel="next" href="/pagenation-link/${Number(req.params.page) + 1}"></link>
  </head>
</html">`);
  });
  app.get('/reload', (_req, res) => {
    res.status(200).send(`
<html lang="en">
  <head>
    <script>window.location.hash = Date.now()</script>
  </head>
  <body style="width:10000px; height:10000px"></body>
</html">`);
  });

  app.get('/*', (req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  ${req.path}
</html">`);
  });
  return app;
};

describe("navigate test", () => {

  const port = 12321;
  let http: http.Server;
  let lanthan: Lanthan;
  let webdriver: WebDriver;
  let browser: any;

  before(async() => {
    let opts = (new FirefoxOptions() as any)
      .setPreference('browser.startup.homepage', `http://127.0.0.1:${port}#home`);
    http = newApp().listen(port);
    lanthan = await Builder
      .forBrowser('firefox')
      .setOptions(opts)
      .spyAddon(path.join(__dirname, '..'))
      .build();
    webdriver = lanthan.getWebDriver();
    browser = lanthan.getWebExtBrowser();
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

  it('should go to parent path without hash by gu', async () => {
    let page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}/a/b/c`);
    await page.sendKeys('g', 'u');

    await eventually(async() => {
      let tab = (await browser.tabs.query({}))[0];
      let url = new URL(tab.url);
      assert.equal(url.pathname, `/a/b/`)
    });
  });

  it('should remove hash by gu', async () => {
    let page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}/a/b/c#hash`);
    await page.sendKeys('g', 'u');

    await eventually(async() => {
      let tab = (await browser.tabs.query({}))[0];
      let url = new URL(tab.url);
      assert.equal(url.hash, '')
      assert.equal(url.pathname, `/a/b/c`)
    });
  });

  it('should go to root path by gU', async () => {
    let page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}/a/b/c#hash`);
    await page.sendKeys('g', Key.SHIFT, 'u');

    await eventually(async() => {
      let tab = (await browser.tabs.query({}))[0];
      let url = new URL(tab.url);
      assert.equal(url.pathname, `/`)
    });
  });

  it('should go back and forward in history by H and L', async () => {
    let page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}/first`);
    await page.navigateTo(`http://127.0.0.1:${port}/second`);
    await page.sendKeys(Key.SHIFT, 'h');

    await eventually(async() => {
      let tab = (await browser.tabs.query({}))[0];
      let url = new URL(tab.url);
      assert.equal(url.pathname, `/first`)
    });

    page = await Page.currentContext(webdriver);
    page.sendKeys(Key.SHIFT, 'l');

    await eventually(async() => {
      let tab = (await browser.tabs.query({}))[0];
      let url = new URL(tab.url);
      assert.equal(url.pathname, `/second`)
    });
  });

  it('should go previous and next page in <a> by [[ and ]]', async () => {
    let page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}/pagenation-a/10`);
    await page.sendKeys('[', '[');

    await eventually(async() => {
      let tab = (await browser.tabs.query({}))[0];
      let url = new URL(tab.url);
      assert.equal(url.pathname, '/pagenation-a/9');
    });
  });

  it('should go next page in <a> by ]]', async () => {
    let page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}/pagenation-a/10`);
    await page.sendKeys(']', ']');

    await eventually(async() => {
      let tab = (await browser.tabs.query({}))[0];
      let url = new URL(tab.url);
      assert.equal(url.pathname, '/pagenation-a/11');
    });
  });

  it('should go previous page in <link> by ]]', async () => {
    let page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}/pagenation-link/10`);
    await page.sendKeys('[', '[');

    await eventually(async() => {
      let tab = (await browser.tabs.query({}))[0];
      let url = new URL(tab.url);
      assert.equal(url.pathname, '/pagenation-link/9');
    });
  });

  it('should go next page by in <link> by [[', async () => {
    let page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}/pagenation-link/10`);
    await page.sendKeys(']', ']');

    await eventually(async() => {
      let tab = (await browser.tabs.query({}))[0];
      let url = new URL(tab.url);
      assert.equal(url.pathname, '/pagenation-link/11');
    });
  });

  it('should go to home page into current tab by gh', async () => {
    let page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}`);
    await page.sendKeys('g', 'h');

    await eventually(async() => {
      let tab = (await browser.tabs.query({}))[0];
      let url = new URL(tab.url);
      assert.equal(url.hash, '#home');
    });
  });

  it('should go to home page into current tab by gH', async () => {
    let page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}`);
    await page.sendKeys('g', Key.SHIFT, 'H');

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.equal(tabs.length, 2);
      assert.equal(new URL(tabs[0].url).hash, '');
      assert.equal(new URL(tabs[1].url).hash, '#home');
      assert.equal(tabs[1].active, true);
    });
  });

  it('should reload current tab by r', async () => {
    let page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}/reload`);
    await page.scrollTo(500, 500);

    let before: number;
    await eventually(async() => {
      let tab = (await browser.tabs.query({}))[0];
      before = Number(new URL(tab.url).hash.split('#')[1]);
      assert.ok(before > 0);
    });

    await page.sendKeys('r');

    let after
    await eventually(async() => {
      let tab = (await browser.tabs.query({}))[0];
      after = Number(new URL(tab.url).hash.split('#')[1]);
      assert.ok(after > before);
    });

    await eventually(async() => {
      let page = await Page.currentContext(webdriver);
      assert.equal(await page.getScrollX(), 500);
    });
  });

  it('should reload current tab without cache by R', async () => {
    let page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}/reload`);
    await page.scrollTo(500, 500);

    let before: number;
    await eventually(async() => {
      let tab = (await browser.tabs.query({}))[0];
      before = Number(new URL(tab.url).hash.split('#')[1]);
      assert.ok(before > 0);
    });

    await page.sendKeys(Key.SHIFT, 'R');

    let after
    await eventually(async() => {
      let tab = (await browser.tabs.query({}))[0];
      after = Number(new URL(tab.url).hash.split('#')[1]);
      assert.ok(after > before);
    });

    await eventually(async() => {
      let page = await Page.currentContext(webdriver);
      assert.equal(await page.getScrollY(), 0);
    });
  });
});
