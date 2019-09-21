const express = require('express');
const path = require('path');
const assert = require('assert');
const eventually = require('./eventually');
const { Builder } = require('lanthan');
const { Key, By } = require('selenium-webdriver');

const newApp = () => {
  let app = express();
  app.get('/', (req, res) => {
    res.send('ok');
  });
  return app;
};

describe("tab test", () => {

  const port = 12321;
  const url = `http://127.0.0.1:${port}/`;

  let http;
  let lanthan;
  let webdriver
  let browser;
  let tabs;

  before(async() => {
    lanthan = await Builder
      .forBrowser('firefox')
      .spyAddon(path.join(__dirname, '..'))
      .build();
    webdriver = lanthan.getWebDriver();
    browser = lanthan.getWebExtBrowser();
    http = newApp().listen(port);

    await webdriver.navigate().to(`${url}`);
  });

  after(async() => {
    if (http) {
      http.close();
    }
    if (lanthan) {
      await lanthan.quit();
    }
  });

  it('repeats last operation', async () => {
    let before = await browser.tabs.query({});

    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let input = await webdriver.findElement(By.css('input'));
    input.sendKeys(`tabopen ${url}newtab`, Key.ENTER);

    await eventually(async() => {
      let current = await browser.tabs.query({ url: `*://*/newtab` });
      assert.equal(current.length, 1);
    });

    body = await webdriver.findElement(By.css('body'));
    await body.sendKeys('.');

    await eventually(async() => {
      let current = await browser.tabs.query({ url: `*://*/newtab` });
      assert.equal(current.length, 2);
    });
  });

  it('repeats last operation', async () => {
    for (let i = 1; i < 5; ++i) {
      await browser.tabs.create({ url: `${url}#${i}` });
    }
    let before = await browser.tabs.query({});

    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys('d');

    await eventually(async() => {
      let current = await browser.tabs.query({});
      assert.equal(current.length,  before.length - 1);
    });

    await browser.tabs.update(before[2].id, { active: true });
    body = await webdriver.findElement(By.css('body'));
    await body.sendKeys('.');

    await eventually(async() => {
      let current = await browser.tabs.query({});
      assert.equal(current.length, before.length - 2);
    });
  });
});
