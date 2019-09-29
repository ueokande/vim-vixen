import * as path from 'path';
import * as assert from 'assert';

import TestServer from './lib/TestServer';
import { Builder, Lanthan } from 'lanthan';
import { WebDriver } from 'selenium-webdriver';
import Page from './lib/Page';

describe("blacklist test", () => {
  let server = new TestServer().receiveContent('/*',
    `<!DOCTYPE html><html lang="en"><body style="width:10000px; height:10000px"></body></html">`,
  );
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
    await server.start();

    let url = server.url('/a').replace('http://', '');
    await browser.storage.local.set({
      settings: {
        source: 'json',
        json: `{
        "keymaps": {
          "j": { "type": "scroll.vertically", "count": 1 }
        },
        "blacklist": [ "${url}" ]
      }`,
      },
    });
  });

  after(async() => {
    await server.stop();
    if (lanthan) {
      await lanthan.quit();
    }
  });

  it('should disable add-on if the URL is in the blacklist', async () => {
    let page = await Page.navigateTo(webdriver, server.url('/a'));
    await page.sendKeys('j')

    let scrollY = await page.getScrollY();
    assert.strictEqual(scrollY, 0);
  });

  it('should enabled add-on if the URL is not in the blacklist', async () => {
    let page = await Page.navigateTo(webdriver, server.url('/ab'));
    await page.sendKeys('j');

    let scrollY = await page.getScrollY();
    assert.strictEqual(scrollY, 64);
  });
});
