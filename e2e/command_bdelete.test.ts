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
  app.get('/*', (req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <head>
    <title>my_${req.path.slice(1)}</title>
  </head>
  <body><h1>${req.path}</h1></body>
</html">`);
  });
  return app;
};

describe('bdelete/bdeletes command test', () => {
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
    http.close();
    if (lanthan) {
      await lanthan.quit();
    }
  });

  beforeEach(async() => {
    let tabs = await browser.tabs.query({});
    for (let tab of tabs.slice(1)) {
      await browser.tabs.remove(tab.id);
    }
    await browser.tabs.update(tabs[0].id, { url: `http://127.0.0.1:${port}/site1`, pinned: true });
    await browser.tabs.create({ url: `http://127.0.0.1:${port}/site2`, pinned: true })
    await browser.tabs.create({ url: `http://127.0.0.1:${port}/site3`, pinned: true })
    await browser.tabs.create({ url: `http://127.0.0.1:${port}/site4` })
    await browser.tabs.create({ url: `http://127.0.0.1:${port}/site5` })

    await eventually(async() => {
      let handles = await webdriver.getAllWindowHandles();
      assert.equal(handles.length, 5);
      await webdriver.switchTo().window(handles[2]);
    });
  });

  it('should delete an unpinned tab by bdelete command', async() => {
    let page = await Page.currentContext(webdriver);
    let console = await page.showConsole();
    await console.execCommand('bdelete site5');

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.deepEqual(tabs.map((t: any) => t.url), [
        `http://127.0.0.1:${port}/site1`,
        `http://127.0.0.1:${port}/site2`,
        `http://127.0.0.1:${port}/site3`,
        `http://127.0.0.1:${port}/site4`,
      ])
    });
  });

  it('should not delete an pinned tab by bdelete command by bdelete command', async() => {
    let page = await Page.currentContext(webdriver);
    let console = await page.showConsole();
    await console.execCommand('bdelete site1');

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.equal(tabs.length, 5);
    });
  });

  it('should show an error when no tabs are matched by bdelete command', async() => {
    let page = await Page.currentContext(webdriver);
    let console = await page.showConsole();
    await console.execCommand('bdelete xyz');

    await eventually(async() => {
      let text = await console.getErrorMessage();
      assert.equal(text, 'No matching buffer for xyz');
    });
  });

  it('should show an error when more than one tabs are matched by bdelete command', async() => {
    let page = await Page.currentContext(webdriver);
    let console = await page.showConsole();
    await console.execCommand('bdelete site');

    await eventually(async() => {
      let text = await console.getErrorMessage();
      assert.equal(text, 'More than one match for site');
    });
  });

  it('should delete an unpinned tab by bdelete! command', async() => {
    let page = await Page.currentContext(webdriver);
    let console = await page.showConsole();
    await console.execCommand('bdelete! site5');

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.deepEqual(tabs.map((t: any) => t.url), [
        `http://127.0.0.1:${port}/site1`,
        `http://127.0.0.1:${port}/site2`,
        `http://127.0.0.1:${port}/site3`,
        `http://127.0.0.1:${port}/site4`,
      ])
    });
  });

  it('should delete an pinned tab by bdelete! command', async() => {
    let page = await Page.currentContext(webdriver);
    let console = await page.showConsole();
    await console.execCommand('bdelete! site1');

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.deepEqual(tabs.map((t: any) => t.url), [
        `http://127.0.0.1:${port}/site2`,
        `http://127.0.0.1:${port}/site3`,
        `http://127.0.0.1:${port}/site4`,
        `http://127.0.0.1:${port}/site5`,
      ])
    });
  });

  it('should delete unpinned tabs by bdeletes command', async() => {
    let page = await Page.currentContext(webdriver);
    let console = await page.showConsole();
    await console.execCommand('bdeletes site');

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.deepEqual(tabs.map((t: any) => t.url), [
        `http://127.0.0.1:${port}/site1`,
        `http://127.0.0.1:${port}/site2`,
        `http://127.0.0.1:${port}/site3`,
      ])
    });
  });

  it('should delete both pinned and unpinned tabs by bdeletes! command', async() => {
    let page = await Page.currentContext(webdriver);
    let console = await page.showConsole();
    await console.execCommand('bdeletes! site');

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.equal(tabs.length, 1);
    });
  });
});
