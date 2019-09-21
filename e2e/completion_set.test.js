const express = require('express');
const lanthan = require('lanthan');
const path = require('path');
const assert = require('assert');
const eventually = require('./eventually');
const settings = require('./settings');
const Console = require('./lib/Console');
const { Builder } = require('lanthan');
const { By } = require('selenium-webdriver');

describe("completion on set commands", () => {
  const port = 12321;
  let lanthan;
  let session;
  let browser;
  let body;

  before(async() => {
    lanthan = await Builder
      .forBrowser('firefox')
      .spyAddon(path.join(__dirname, '..'))
      .build();
    webdriver = lanthan.getWebDriver();
    browser = lanthan.getWebExtBrowser();

    await browser.storage.local.set({
      settings,
    });
  });

  after(async() => {
    if (lanthan) {
      await lanthan.quit();
    }
  });

  beforeEach(async() => {
    await webdriver.navigate().to(`about:blank`);
    body = await webdriver.findElement(By.css('body'));
  });

  it('should show all property names by "set" command with empty params', async() => {
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let c = new Console(webdriver);
    await c.sendKeys('set ');

    await eventually(async() => {
      let items = await c.getCompletions();
      assert.equal(items.length, 5);
      assert.deepEqual(items[0], { type: 'title', text: 'Properties' });
      assert(items[1].text.startsWith('hintchars'))
      assert(items[2].text.startsWith('smoothscroll'))
      assert(items[3].text.startsWith('nosmoothscroll'))
      assert(items[4].text.startsWith('complete'))
    });
  });

  it('should show filtered property names by "set" command', async() => {
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let c = new Console(webdriver);
    await c.sendKeys('set no');

    await eventually(async() => {
      let items = await c.getCompletions();
      assert.equal(items.length, 2);
      assert(items[1].text.includes('nosmoothscroll'))
    });
  });
});
