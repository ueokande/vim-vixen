import * as path from 'path';
import * as assert from 'assert';

import TestServer from './lib/TestServer';
import { Builder, Lanthan } from 'lanthan';
import { WebDriver, Key } from 'selenium-webdriver';
import Page from './lib/Page';

describe("console test", () => {
  let server = new TestServer().receiveContent('/', 
    `<!DOCTYPE html><html lang="en"><head><title>Hello, world!</title></head></html">`,
  );
  let lanthan: Lanthan;
  let webdriver: WebDriver;
  let page: Page;

  before(async() => {
    lanthan = await Builder
      .forBrowser('firefox')
      .spyAddon(path.join(__dirname, '..'))
      .build();
    webdriver = lanthan.getWebDriver();
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

  it('open console with :', async() => {
    await page.sendKeys(':');
    let console = await page.getConsole();
    assert.strictEqual(await console.currentValue(), '');
  });

  it('open console with open command by o', async() => {
    await page.sendKeys('o');
    let console = await page.getConsole();
    assert.strictEqual(await console.currentValue(), 'open ');
  });

  it('open console with open command and current URL by O', async() => {
    await page.sendKeys(Key.SHIFT, 'o');
    let console = await page.getConsole();
    assert.strictEqual(await console.currentValue(), `open ${server.url()}`);
  });

  it('open console with tabopen command by t', async() => {
    await page.sendKeys('t');
    let console = await page.getConsole();
    assert.strictEqual(await console.currentValue(), 'tabopen ');
  });

  it('open console with tabopen command and current URL by T', async() => {
    await page.sendKeys(Key.SHIFT, 't');
    let console = await page.getConsole();
    assert.strictEqual(await console.currentValue(), `tabopen ${server.url()}`);
  });

  it('open console with winopen command by w', async() => {
    await page.sendKeys('w');
    let console = await page.getConsole();
    assert.strictEqual(await console.currentValue(), `winopen `);
  });

  it('open console with winopen command and current URL by W', async() => {
    await page.sendKeys(Key.SHIFT, 'W');
    let console = await page.getConsole();
    assert.strictEqual(await console.currentValue(), `winopen ${server.url()}`);
  });

  it('open console with buffer command by b', async() => {
    await page.sendKeys('b');
    let console = await page.getConsole();
    assert.strictEqual(await console.currentValue(), `buffer `);
  });

  it('open console with addbookmark command with title by a', async() => {
    await page.sendKeys('a');
    let console = await page.getConsole();
    assert.strictEqual(await console.currentValue(), `addbookmark Hello, world!`);
  });
});
