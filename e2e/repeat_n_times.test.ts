import * as path from 'path';
import * as assert from 'assert';

import TestServer from './lib/TestServer';
import eventually from './eventually';
import { Builder, Lanthan } from 'lanthan';
import { WebDriver } from 'selenium-webdriver';
import Page from './lib/Page';

describe("tab test", () => {
  const server = new TestServer().receiveContent('/',
    `<!DOCTYPE html><html lang="en"><body style="width:10000px; height:10000px"></body></html>`,
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

    browser = browser;
  });

  after(async() => {
    await server.stop();
    if (lanthan) {
      await lanthan.quit();
    }
  });

  it('repeats scroll 3-times', async () => {
    const page = await Page.navigateTo(webdriver, server.url());
    await page.sendKeys('3', 'j');

    const scrollY = await page.getScrollY();
    assert.strictEqual(scrollY, 64 * 3);
  });

  it('repeats tab deletion 3-times', async () => {
    const win = await browser.windows.create({ url: server.url('/#0') });
    for (let i = 1; i < 5; ++i) {
      await browser.tabs.create({ url: server.url('/#' + i), windowId: win.id });
      await webdriver.navigate().to(server.url('/#' + i));
    }

    const page = await Page.navigateTo(webdriver, server.url());
    await page.sendKeys('3', 'd');

    await eventually(async() => {
      const current = await browser.tabs.query({ windowId: win.id });
      assert.strictEqual(current.length, 2);
    });
  });
});
