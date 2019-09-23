import express from 'express';
import * as path from 'path';
import * as assert from 'assert';

import { Builder, Lanthan } from 'lanthan';
import { WebDriver } from 'selenium-webdriver';
import * as http from 'http';
import Page from './lib/Page';

const newApp = () => {
  let app = express();
  app.get('/*', (_req, res) => {
    res.status(200).send(`<!DOCTYPEhtml>
<html lang="en">
  <body style="width:10000px; height:10000px"></body>
</html>`);
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
    http.close();
  });

  it('should disable add-on if the URL is in the blacklist', async () => {
    await browser.storage.local.set({
      settings: {
        source: 'json',
        json: `{
        "keymaps": {
          "j": { "type": "scroll.vertically", "count": 1 }
        },
        "blacklist": [ "127.0.0.1:${port}/a" ]
      }`,
      },
    });

    let page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}/a`);
    await page.sendKeys('j')

    // not works
    let pageYOffset = await webdriver.executeScript(() => window.pageYOffset);
    let scrollY = await page.getScrollY();
    assert.equal(pageYOffset, 0);

    page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}/ab`);
    await page.sendKeys('j');

    // works
    scrollY = await page.getScrollY();
    assert.equal(scrollY, 64);
  });
});
