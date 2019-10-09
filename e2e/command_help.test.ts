import * as path from 'path';
import * as assert from 'assert';

import TestServer from './lib/TestServer';
import eventually from './eventually';
import { Builder, Lanthan } from 'lanthan';
import { WebDriver } from 'selenium-webdriver';
import Page from './lib/Page';

describe("help command test", () => {
  let server = new TestServer();
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

    await server.start();
  });

  after(async() => {
    await server.stop();
    if (lanthan) {
      await lanthan.quit();
    }
  });

  beforeEach(async() => {
    page = await Page.navigateTo(webdriver, server.url());
  });

  it('should open help page by help command ', async() => {
    let console = await page.showConsole();
    await console.execCommand('help');

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true });
      assert.strictEqual(tabs[0].url, 'https://ueokande.github.io/vim-vixen/')
    });
  });
});

