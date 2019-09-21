const express = require('express');
const path = require('path');
const assert = require('assert');
const eventually = require('./eventually');
const { Builder } = require('lanthan');
const { Key, By } = require('selenium-webdriver');

const newApp = () => {
  let app = express();
  app.get('/', (req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <head>
    <title>Hello, world!</title>
  </head>
</html">`);
  });
  return app;
};


describe("console test", () => {
  const port = 12321;
  let http;
  let lanthan;
  let webdriver;
  let browser;
  let tab;
  let body;

  before(async() => {
    http = newApp().listen(port);
    lanthan = await Builder
      .forBrowser('firefox')
      .spyAddon(path.join(__dirname, '..'))
      .build();
    webdriver = lanthan.getWebDriver();
    browser = lanthan.getWebExtBrowser();
  });

  after(async() => {
    if (lanthan) {
      await lanthan.quit();
    }
    if (http) {
      http.close();
    }
  });

  beforeEach(async() => {
    await webdriver.navigate().to(`http://127.0.0.1:${port}`);
    body = await webdriver.findElement(By.css('body'));
  });

  it('open console with :', async() => {
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    
    let input = await webdriver.findElement(By.css('input'));
    assert.equal(await input.isDisplayed(), true);
  });

  it('open console with open command by o', async() => {
    await body.sendKeys('o');

    await webdriver.switchTo().frame(0);
    let value = await webdriver.executeScript(() => document.querySelector('input').value);
    assert.equal(value, 'open ');
  });

  it('open console with open command and current URL by O', async() => {
    await body.sendKeys(Key.SHIFT, 'o');

    await webdriver.switchTo().frame(0);
    let value = await webdriver.executeScript(() => document.querySelector('input').value);
    assert.equal(value, `open http://127.0.0.1:${port}/`);
  });

  it('open console with tabopen command by t', async() => {
    await body.sendKeys('t');

    await webdriver.switchTo().frame(0);
    let value = await webdriver.executeScript(() => document.querySelector('input').value);
    assert.equal(value, 'tabopen ');
  });

  it('open console with tabopen command and current URL by T', async() => {
    await body.sendKeys(Key.SHIFT, 't');

    await webdriver.switchTo().frame(0);
    let value = await webdriver.executeScript(() => document.querySelector('input').value);
    assert.equal(value, `tabopen http://127.0.0.1:${port}/`);
  });

  it('open console with winopen command by w', async() => {
    await body.sendKeys('w');

    await webdriver.switchTo().frame(0);
    let value = await webdriver.executeScript(() => document.querySelector('input').value);
    assert.equal(value, 'winopen ');
  });

  it('open console with winopen command and current URL by W', async() => {
    await body.sendKeys(Key.SHIFT, 'W');

    await webdriver.switchTo().frame(0);
    let value = await webdriver.executeScript(() => document.querySelector('input').value);
    assert.equal(value, `winopen http://127.0.0.1:${port}/`);
  });

  it('open console with buffer command by b', async() => {
    await body.sendKeys('b');

    await webdriver.switchTo().frame(0);
    let value = await webdriver.executeScript(() => document.querySelector('input').value);
    assert.equal(value, `buffer `);
  });

  it('open console with addbookmark command with title by a', async() => {
    await body.sendKeys('a');

    await webdriver.switchTo().frame(0);
    let value = await webdriver.executeScript(() => document.querySelector('input').value);
    assert.equal(value, `addbookmark Hello, world!`);
  });
});

