const express = require('express');
const path = require('path');
const assert = require('assert');
const eventually = require('./eventually');
const settings = require('./settings');
const { Builder } = require('lanthan');
const { By, Key } = require('selenium-webdriver');

const newApp = () => {

  let app = express();
  for (let name of ['google', 'yahoo', 'bing', 'duckduckgo', 'twitter', 'wikipedia']) {
    app.get('/' + name, (req, res) => {
      res.send(`<!DOCTYPEhtml>
<html lang="en">
  <body><h1>${name.charAt(0).toUpperCase() + name.slice(1)}</h1></body>
</html">`);
    });
  }
  app.get('/', (req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <body><h1>home</h1></body>
</html">`);
  });
  return app;
};

describe("open command test", () => {
  const port = 12321;
  let http;
  let lanthan;
  let webdriver;
  let browser;
  let body;

  before(async() => {
    lanthan = await Builder
      .forBrowser('firefox')
      .spyAddon(path.join(__dirname, '..'))
      .build();
    webdriver = lanthan.getWebDriver();
    browser = lanthan.getWebExtBrowser();
    http = newApp().listen(port);

    await browser.storage.local.set({
      settings,
    });
  });

  after(async() => {
    http.close();
    if (lanthan) {
      await lanthan.quit();
    }
  });

  beforeEach(async() => {
    await webdriver.navigate().to(`http://127.0.0.1:${port}`);
    body = await webdriver.findElement(By.css('body'));
  })

  it('should open default search for keywords by open command ', async() => {
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let input = await webdriver.findElement(By.css('input'));
    input.sendKeys('open an apple', Key.ENTER);

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true });
      let url = new URL(tabs[0].url);
      assert.equal(url.href, `http://127.0.0.1:${port}/google?q=an%20apple`)
    });
  });

  it('should open certain search page for keywords by open command ', async() => {
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let input = await webdriver.findElement(By.css('input'));
    input.sendKeys('open yahoo an apple', Key.ENTER);

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true })
      let url = new URL(tabs[0].url);
      assert.equal(url.href, `http://127.0.0.1:${port}/yahoo?q=an%20apple`)
    });
  });

  it('should open default engine with empty keywords by open command ', async() => {
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let input = await webdriver.findElement(By.css('input'));
    input.sendKeys('open', Key.ENTER);

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true })
      let url = new URL(tabs[0].url);
      assert.equal(url.href, `http://127.0.0.1:${port}/google?q=`)
    });
  });

  it('should open certain search page for empty keywords by open command ', async() => {
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let input = await webdriver.findElement(By.css('input'));
    input.sendKeys('open yahoo', Key.ENTER);

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true })
      let url = new URL(tabs[0].url);
      assert.equal(url.href, `http://127.0.0.1:${port}/yahoo?q=`)
    });
  });

  it('should open a site with domain by open command ', async() => {
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let input = await webdriver.findElement(By.css('input'));
    input.sendKeys('open i-beam.org', Key.ENTER);

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true })
      let url = new URL(tabs[0].url);
      assert.equal(url.href, 'https://i-beam.org/')
    });
  });

  it('should open a site with URL by open command ', async() => {
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let input = await webdriver.findElement(By.css('input'));
    input.sendKeys('open https://i-beam.org', Key.ENTER);

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true })
      let url = new URL(tabs[0].url);
      assert.equal(url.href, 'https://i-beam.org/')
    });
  });
});
