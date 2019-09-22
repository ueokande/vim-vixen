import * as path from 'path';
import * as assert from 'assert';

import eventually from './eventually';
import { Builder, Lanthan } from 'lanthan';
import { WebDriver, WebElement, By } from 'selenium-webdriver';


describe("zoom test", () => {
  let lanthan: Lanthan;
  let webdriver: WebDriver;
  let browser: any;
  let tab: any;
  let body: WebElement;

  before(async() => {
    lanthan = await Builder
      .forBrowser('firefox')
      .spyAddon(path.join(__dirname, '..'))
      .build();
    webdriver = lanthan.getWebDriver();
    browser = lanthan.getWebExtBrowser();
    tab = (await browser.tabs.query({}))[0]
  });

  after(async() => {
    await lanthan.quit();
  });

  beforeEach(async() => {
    await webdriver.navigate().to('about:blank');
    body = await webdriver.findElement(By.css('body'));
  });

  it('should zoom in by zi', async () => {
    let before = await browser.tabs.getZoom(tab.id);
    await body.sendKeys('z', 'i');

    await eventually(async() => {
      let actual = await browser.tabs.getZoom(tab.id);
      assert.ok(before < actual);
    });
  });

  it('should zoom out by zo', async () => {
    let before = await browser.tabs.getZoom(tab.id);
    await body.sendKeys('z', 'o');

    await eventually(async() => {
      let actual = await browser.tabs.getZoom(tab.id);
      assert.ok(before > actual);
    });
  });

  it('scrolls left by h', async () => {
    await browser.tabs.setZoom(tab.id, 2);
    await body.sendKeys('z', 'z');

    await eventually(async() => {
      let actual = await browser.tabs.getZoom(tab.id);
      assert.ok(actual === 1);
    });
  });
});

