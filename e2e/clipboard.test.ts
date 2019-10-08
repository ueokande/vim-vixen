import * as assert from 'assert';
import * as path from 'path';

import TestServer from './lib/TestServer';
import eventually from './eventually';
import * as clipboard from './lib/clipboard';
import { Builder, Lanthan } from 'lanthan';
import { WebDriver, Key } from 'selenium-webdriver';
import Page from './lib/Page';
import SettingRepository from "./lib/SettingRepository";
import Settings from "../src/shared/settings/Settings";

describe("clipboard test", () => {
  let server = new TestServer(12321).receiveContent('/happy', 'ok');
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

    await new SettingRepository(browser).saveJSON(Settings.fromJSON({
      search: {
        default: "google",
        engines: {
          "google": "http://127.0.0.1:12321/google?q={}",
        },
      },
    }));

    await server.start();
  });

  after(async() => {
    await server.stop();
    if (lanthan) {
      await lanthan.quit();
    }
  });

  beforeEach(async() => {
    let tabs = await browser.tabs.query({});
    for (let tab of tabs.slice(1)) {
      await browser.tabs.remove(tab.id);
    }
  });

  it('should copy current URL by y', async () => {
    let page = await Page.navigateTo(webdriver, server.url('/#should_copy_url'));
    await page.sendKeys('y');

    await eventually(async() => {
      let data = await clipboard.read();
      assert.strictEqual(data, server.url('/#should_copy_url'));
    });
  });

  it('should open an URL from clipboard by p', async () => {
    await clipboard.write(server.url('/#open_from_clipboard'));

    let page = await Page.navigateTo(webdriver, server.url());
    await page.sendKeys('p');

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true });
      assert.strictEqual(tabs[0].url, server.url('/#open_from_clipboard'));
    });
  });

  it('should open an URL from clipboard to new tab by P', async () => {
    await clipboard.write(server.url('/#open_to_new_tab'));

    let page = await Page.navigateTo(webdriver, server.url());
    await page.sendKeys(Key.SHIFT, 'p');

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.deepStrictEqual(tabs.map((t: any) => t.url), [
        server.url(),
        server.url('/#open_to_new_tab'),
      ]);
    });
  });

  it('should open search result with keywords in clipboard by p', async () => {
    await clipboard.write(`an apple`);

    let page = await Page.navigateTo(webdriver, server.url());
    await page.sendKeys(Key.SHIFT, 'p');

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true });
      assert.strictEqual(tabs[0].url, server.url('/google?q=an%20apple'));
    });
  });

  it('should open search result with keywords in clipboard to new tabby P', async () => {
    await clipboard.write(`an apple`);

    let page = await Page.navigateTo(webdriver, server.url());
    await page.sendKeys(Key.SHIFT, 'p');

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.deepStrictEqual(tabs.map((t: any) => t.url), [
        server.url(),
        server.url('/google?q=an%20apple'),
      ]);
    });
  });
});
