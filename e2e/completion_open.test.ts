import * as path from 'path';
import * as assert from 'assert';

import Settings from "../src/shared/settings/Settings";
import TestServer from './lib/TestServer';
import eventually from './eventually';
import { Builder, Lanthan } from 'lanthan';
import { WebDriver } from 'selenium-webdriver';
import Page from './lib/Page';
import SettingRepository from "./lib/SettingRepository";

describe("completion on open/tabopen/winopen commands", () => {
  let server = new TestServer().receiveContent('/*', 'ok');
  let lanthan: Lanthan;
  let webdriver: WebDriver;
  let browser: any;
  let page: Page;

  before(async() => {
    await server.start();

    lanthan = await Builder
      .forBrowser('firefox')
      .spyAddon(path.join(__dirname, '..'))
      .build();
    webdriver = lanthan.getWebDriver();
    browser = lanthan.getWebExtBrowser();

    // Add item into hitories
    await webdriver.navigate().to(('https://example.com/'));
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

  it('should show completions from search engines, bookmarks, and histories by "open" command', async() => {
    let console = await page.showConsole();
    await console.inputKeys('open ');

    await eventually(async() => {
      let completions = await console.getCompletions();
      assert.ok(completions.find(x => x.type === 'title' && x.text === 'Search Engines'));
      assert.ok(completions.find(x => x.type === 'title' && x.text === 'Bookmarks'));
      assert.ok(completions.find(x => x.type === 'title' && x.text === 'History'));
    });
  });

  it('should filter items with URLs by keywords on "open" command', async() => {
    let console = await page.showConsole();
    await console.inputKeys('open https://');

    await eventually(async() => {
      let completions = await console.getCompletions();
      let items = completions.filter(x => x.type === 'item').map(x => x.text);
      assert.ok(items.every(x => x.includes('https://')));
    });
  });

  it('should filter items with titles by keywords on "open" command', async() => {
    let console = await page.showConsole();
    await console.inputKeys('open getting');

    await eventually(async() => {
      let completions = await console.getCompletions();
      let items = completions.filter(x => x.type === 'item').map(x => x.text);
      assert.ok(items.every(x => x.toLowerCase().includes('getting')));
    });
  });

  it('should filter items with titles by keywords on "tabopen" command', async() => {
    let console = await page.showConsole();
    await console.inputKeys('tabopen getting');

    await eventually(async() => {
      let completions = await console.getCompletions();
      let items = completions.filter(x => x.type === 'item').map(x => x.text);
      assert.ok(items.every(x => x.includes('https://')));
    });
  });

  it('should filter items with titles by keywords on "winopen" command', async() => {
    let console = await page.showConsole();
    await console.inputKeys('winopen https://');

    await eventually(async() => {
      let completions = await console.getCompletions();
      let items = completions.filter(x => x.type === 'item').map(x => x.text);
      assert.ok(items.every(x => x.includes('https://')));
    });
  });

  it('should display only specified items in "complete" property by set command', async() => {
    let console = await page.showConsole();
    await console.execCommand('set complete=sbh');
    await (webdriver.switchTo() as any).parentFrame();

    console = await page.showConsole();
    await console.inputKeys('open ');

    await eventually(async() => {
      let completions = await console.getCompletions();
      let titles = completions.filter(x => x.type === 'title').map(x => x.text);
      assert.deepStrictEqual(titles, ['Search Engines', 'Bookmarks', 'History'])
    });

    await console.close();
    console = await page.showConsole();
    await console.execCommand('set complete=bss');
    await (webdriver.switchTo() as any).parentFrame();

    console = await page.showConsole();
    await console.inputKeys('open ');

    await eventually(async() => {
      let completions = await console.getCompletions();
      let titles = completions.filter(x => x.type === 'title').map(x => x.text);
      assert.deepStrictEqual(titles, ['Bookmarks', 'Search Engines', 'Search Engines'])
    });
  });

  it('should display only specified items in "complete" property by setting', async() => {
    new SettingRepository(browser).saveJSON(Settings.fromJSON({
      properties: { complete: "sbh" },
    }));

    let console = await page.showConsole();
    await console.inputKeys('open ');

    await eventually(async() => {
      let completions = await console.getCompletions();
      let titles = completions.filter(x => x.type === 'title').map(x => x.text);
      assert.deepStrictEqual(titles, ['Search Engines', 'Bookmarks', 'History'])
    });

    await console.close();
    await (webdriver.switchTo() as any).parentFrame();

    new SettingRepository(browser).saveJSON(Settings.fromJSON({
      properties: { complete: "bss" },
    }));

    console = await page.showConsole();
    await console.inputKeys('open ');

    await eventually(async() => {
      let completions = await console.getCompletions();
      let titles = completions.filter(x => x.type === 'title').map(x => x.text);
      assert.deepStrictEqual(titles, ['Bookmarks', 'Search Engines', 'Search Engines'])
    });
  });
});
