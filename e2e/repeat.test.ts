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
    res.send('ok');
  });
  return app;
};

describe("tab test", () => {
  const port = 12321;
  const url = `http://127.0.0.1:${port}/`;

  let http: http.Server;
  let lanthan: Lanthan;
  let webdriver: WebDriver;
  let browser: any;

  before(async() => {
    lanthan = await Builder
      .forBrowser('firefox')
      .spyAddon(path.join(__dirname, '..'))
      .build();
    webdriver = lanthan.getWebDriver();
    browser = lanthan.getWebExtBrowser();
    http = newApp().listen(port);
  });

  after(async() => {
    if (http) {
      http.close();
    }
    if (lanthan) {
      await lanthan.quit();
    }
  });

  it('repeats last command', async () => {
    let page = await Page.navigateTo(webdriver, url);
    let console = await page.showConsole();
    await console.execCommand(`tabopen ${url}newtab`);

    await eventually(async() => {
      let current = await browser.tabs.query({ url: `*://*/newtab` });
      assert.equal(current.length, 1);
    });

    page = await Page.currentContext(webdriver);
    await page.sendKeys('.');

    await eventually(async() => {
      let current = await browser.tabs.query({ url: `*://*/newtab` });
      assert.equal(current.length, 2);
    });
  });

  it('repeats last operation', async () => {
    for (let i = 1; i < 5; ++i) {
      await browser.tabs.create({ url: `${url}#${i}` });
    }
    let before = await browser.tabs.query({});

    let page = await Page.currentContext(webdriver);
    await page.sendKeys('d');

    await eventually(async() => {
      let current = await browser.tabs.query({});
      assert.equal(current.length,  before.length - 1);
    });

    await browser.tabs.update(before[2].id, { active: true });
    page = await Page.currentContext(webdriver);
    await page.sendKeys('.');

    await eventually(async() => {
      let current = await browser.tabs.query({});
      assert.equal(current.length, before.length - 2);
    });
  });
});
