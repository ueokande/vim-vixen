import * as path from 'path';
import * as assert from 'assert';

import TestServer from './lib/TestServer';
import { Builder, Lanthan } from 'lanthan';
import { WebDriver } from 'selenium-webdriver';
import Page from './lib/Page';
import Settings from '../src/shared/settings/Settings';
import SettingRepository from './lib/SettingRepository';

describe("partial blacklist test", () => {
  let server = new TestServer().receiveContent('/*',
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

    let url = server.url().replace('http://', '');
    await new SettingRepository(browser).saveJSON(Settings.fromJSON({
      keymaps: {
        j: { type: 'scroll.vertically', count: 1 },
        k: { type: 'scroll.vertically', count: -1 },
      },
      blacklist: [
        { 'url': url, 'keys': ['k'] }
      ]
    }));
  });

  after(async() => {
    await server.stop();
    if (lanthan) {
      await lanthan.quit();
    }
  });

  it('should disable keys in the partial blacklist', async () => {
    let page = await Page.navigateTo(webdriver, server.url('/'));

    await page.sendKeys('j');
    let scrollY = await page.getScrollY();
    assert.strictEqual(scrollY, 64);

    await page.sendKeys('k');
    scrollY = await page.getScrollY();
    assert.strictEqual(scrollY, 64);
  });
});
