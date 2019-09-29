import * as path from 'path';
import * as assert from 'assert';

import TestServer from './lib/TestServer';
import eventually from './eventually';
import { Builder, Lanthan } from 'lanthan';
import { WebDriver } from 'selenium-webdriver';
import Page from './lib/Page';

describe('bdelete/bdeletes command test', () => {
  let server = new TestServer().receiveContent('/*', 'ok');
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
    await browser.tabs.update(tabs[0].id, { url: server.url('/site1'), pinned: true });
    await browser.tabs.create({ url: server.url('/site2'), pinned: true })
    await browser.tabs.create({ url: server.url('/site3'), pinned: true })
    await browser.tabs.create({ url: server.url('/site4'), })
    await browser.tabs.create({ url: server.url('/site5'), })

    await eventually(async() => {
      let handles = await webdriver.getAllWindowHandles();
      assert.strictEqual(handles.length, 5);
      await webdriver.switchTo().window(handles[2]);
    });
  });

  it('should delete an unpinned tab by bdelete command', async() => {
    let page = await Page.currentContext(webdriver);
    let console = await page.showConsole();
    await console.execCommand('bdelete site5');

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.deepStrictEqual(tabs.map((t: any) => t.url), [
        server.url('/site1'),
        server.url('/site2'),
        server.url('/site3'),
        server.url('/site4'),
      ])
    });
  });

  it('should not delete an pinned tab by bdelete command by bdelete command', async() => {
    let page = await Page.currentContext(webdriver);
    let console = await page.showConsole();
    await console.execCommand('bdelete site1');

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.strictEqual(tabs.length, 5);
    });
  });

  it('should show an error when no tabs are matched by bdelete command', async() => {
    let page = await Page.currentContext(webdriver);
    let console = await page.showConsole();
    await console.execCommand('bdelete xyz');

    await eventually(async() => {
      let text = await console.getErrorMessage();
      assert.strictEqual(text, 'No matching buffer for xyz');
    });
  });

  it('should show an error when more than one tabs are matched by bdelete command', async() => {
    let page = await Page.currentContext(webdriver);
    let console = await page.showConsole();
    await console.execCommand('bdelete site');

    await eventually(async() => {
      let text = await console.getErrorMessage();
      assert.strictEqual(text, 'More than one match for site');
    });
  });

  it('should delete an unpinned tab by bdelete! command', async() => {
    let page = await Page.currentContext(webdriver);
    let console = await page.showConsole();
    await console.execCommand('bdelete! site5');

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.deepStrictEqual(tabs.map((t: any) => t.url), [
        server.url('/site1'),
        server.url('/site2'),
        server.url('/site3'),
        server.url('/site4'),
      ])
    });
  });

  it('should delete an pinned tab by bdelete! command', async() => {
    let page = await Page.currentContext(webdriver);
    let console = await page.showConsole();
    await console.execCommand('bdelete! site1');

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.deepStrictEqual(tabs.map((t: any) => t.url), [
        server.url('/site2'),
        server.url('/site3'),
        server.url('/site4'),
        server.url('/site5'),
      ])
    });
  });

  it('should delete unpinned tabs by bdeletes command', async() => {
    let page = await Page.currentContext(webdriver);
    let console = await page.showConsole();
    await console.execCommand('bdeletes site');

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.deepStrictEqual(tabs.map((t: any) => t.url), [
        server.url('/site1'),
        server.url('/site2'),
        server.url('/site3'),
      ])
    });
  });

  it('should delete both pinned and unpinned tabs by bdeletes! command', async() => {
    let page = await Page.currentContext(webdriver);
    let console = await page.showConsole();
    await console.execCommand('bdeletes! site');

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.strictEqual(tabs.length, 1);
    });
  });
});
