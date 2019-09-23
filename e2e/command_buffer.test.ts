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

describe('buffer command test', () => {
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
    await browser.tabs.update(tabs[0].id, { url: `http://127.0.0.1:${port}/site1` });
    for (let i = 2; i <= 5; ++i) {
      await browser.tabs.create({ url: `http://127.0.0.1:${port}/site${i}`})
    }

    await eventually(async() => {
      let handles = await webdriver.getAllWindowHandles();
      assert.equal(handles.length, 5);
      await webdriver.switchTo().window(handles[2]);
    });
  });

  it('should do nothing by buffer command with no parameters', async() => {
    let page = await Page.currentContext(webdriver);
    let console = await page.showConsole();
    await console.execCommand('buffer');

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true });
      assert.equal(tabs[0].index, 2);
    });
  });

  it('should select a tab by buffer command with a number', async() => {
    let page = await Page.currentContext(webdriver);
    let console = await page.showConsole();
    await console.execCommand('buffer 1');

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true });
      assert.equal(tabs[0].index, 0);
    });
  });

  it('should should an out of range error by buffer commands', async() => {
    let page = await Page.currentContext(webdriver);
    let console = await page.showConsole();
    await console.execCommand('buffer 0');

    await eventually(async() => {
      let text = await console.getErrorMessage();
      assert.equal(text, 'tab 0 does not exist');
    });

    await (webdriver.switchTo() as any).parentFrame();

    console = await page.showConsole();
    await console.execCommand('buffer 9');

    await eventually(async() => {
      let text = await console.getErrorMessage();
      assert.equal(text, 'tab 9 does not exist');
    });
  });

  it('should select a tab by buffer command with a title', async() => {
    let page = await Page.currentContext(webdriver);
    let console = await page.showConsole();
    await console.execCommand('buffer my_site1');

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true });
      assert.equal(tabs[0].index, 0);
    });
  });

  it('should select a tab by buffer command with an URL', async() => {
    let page = await Page.currentContext(webdriver);
    let console = await page.showConsole();
    await console.execCommand('buffer /site1');

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true });
      assert.equal(tabs[0].index, 0);
    });
  });

  it('should select tabs rotately', async() => {
    let handles = await webdriver.getAllWindowHandles();
    await webdriver.switchTo().window(handles[4]);

    let page = await Page.currentContext(webdriver);
    let console = await page.showConsole();
    await console.execCommand('buffer site');

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true });
      assert.equal(tabs[0].index, 0);
    });
  });

  it('should do nothing by ":buffer %"', async() => {
    let page = await Page.currentContext(webdriver);
    let console = await page.showConsole();
    await console.execCommand('buffer %');

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true });
      assert.equal(tabs[0].index, 2);
    });
  });

  it('should selects last selected tab by ":buffer #"', async() => {
    let handles = await webdriver.getAllWindowHandles();
    await webdriver.switchTo().window(handles[1]);

    let page = await Page.currentContext(webdriver);
    let console = await page.showConsole();
    await console.execCommand('buffer #');

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true });
      assert.equal(tabs[0].index, 2);
    });
  });
});
