const express = require('express');
const lanthan = require('lanthan');
const path = require('path');
const assert = require('assert');
const eventually = require('./eventually');

const Key = lanthan.Key;

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


describe("zoom test", () => {
  const port = 12321;
  let http;
  let firefox;
  let session;
  let browser;
  let tab;
  let body;

  before(async() => {
    firefox = await lanthan.firefox();
    await firefox.session.installAddon(path.join(__dirname, '..'));
    session = firefox.session;
    browser = firefox.browser;
    http = newApp().listen(port);
  });

  after(async() => {
    http.close();
    if (firefox) {
      await firefox.close();
    }
  });

  beforeEach(async() => {
    await session.navigateTo(`http://127.0.0.1:${port}`);
    body = await session.findElementByCSS('body');
  });

  it('open console with :', async() => {
    await body.sendKeys(':');

    await session.switchToFrame(0);
    
    let input = await session.findElementByCSS('input');
    assert.equal(await input.isDisplayed(), true);
  });

  it('open console with open command by o', async() => {
    await body.sendKeys('o');

    await session.switchToFrame(0);
    let value = await session.executeScript(() => document.querySelector('input').value);
    assert.equal(value, 'open ');
  });

  it('open console with open command and current URL by O', async() => {
    await body.sendKeys(Key.Shift, 'o');

    await session.switchToFrame(0);
    let value = await session.executeScript(() => document.querySelector('input').value);
    assert.equal(value, `open http://127.0.0.1:${port}/`);
  });

  it('open console with tabopen command by t', async() => {
    await body.sendKeys('t');

    await session.switchToFrame(0);
    let value = await session.executeScript(() => document.querySelector('input').value);
    assert.equal(value, 'tabopen ');
  });

  it('open console with tabopen command and current URL by T', async() => {
    await body.sendKeys(Key.Shift, 't');

    await session.switchToFrame(0);
    let value = await session.executeScript(() => document.querySelector('input').value);
    assert.equal(value, `tabopen http://127.0.0.1:${port}/`);
  });

  it('open console with winopen command by w', async() => {
    await body.sendKeys('w');

    await session.switchToFrame(0);
    let value = await session.executeScript(() => document.querySelector('input').value);
    assert.equal(value, 'winopen ');
  });

  it('open console with winopen command and current URL by W', async() => {
    await body.sendKeys(Key.Shift, 'W');

    await session.switchToFrame(0);
    let value = await session.executeScript(() => document.querySelector('input').value);
    assert.equal(value, `winopen http://127.0.0.1:${port}/`);
  });

  it('open console with buffer command by b', async() => {
    await body.sendKeys('b');

    await session.switchToFrame(0);
    let value = await session.executeScript(() => document.querySelector('input').value);
    assert.equal(value, `buffer `);
  });

  it('open console with addbookmark command with title by a', async() => {
    await body.sendKeys('a');

    await session.switchToFrame(0);
    let value = await session.executeScript(() => document.querySelector('input').value);
    assert.equal(value, `addbookmark Hello, world!`);
  });
});

