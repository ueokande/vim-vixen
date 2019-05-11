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
  <body style="width:10000px; height:10000px"></body>
</html">`);
  });
  return app;
};

describe("mark test", () => {

  const port = 12321;
  let http;
  let firefox;
  let session;
  let browser;

  before(async() => {
    http = newApp().listen(port);

    firefox = await lanthan.firefox();
    await firefox.session.installAddonFromPath(path.join(__dirname, '..'));
    session = firefox.session;
    browser = firefox.browser;
  });

  after(async() => {
    if (firefox) {
      await firefox.close();
    }
    http.close();
  });

  it('should set a local mark and jump to it', async () => {
    await session.navigateTo(`http://127.0.0.1:${port}`);
    let body = await session.findElementByCSS('body');

    await session.executeScript(() => window.scrollTo(200, 200));
    await body.sendKeys('m', 'a');
    await session.executeScript(() => window.scrollTo(500, 500));
    await body.sendKeys('\'', 'a');

    await eventually(async() => {
      let pageXOffset = await session.executeScript(() => window.pageXOffset);
      let pageYOffset = await session.executeScript(() => window.pageYOffset);
      assert.equal(pageXOffset, 200);
      assert.equal(pageYOffset, 200);
    });
  });

  it('should set a global mark and jump to it', async () => {
    await session.navigateTo(`http://127.0.0.1:${port}#first`);
    let body = await session.findElementByCSS('body');

    await session.executeScript(() => window.scrollTo(200, 200));
    await body.sendKeys('m', 'A');
    await session.executeScript(() => window.scrollTo(500, 500));
    await body.sendKeys('\'', 'A');

    await eventually(async() => {
      let pageXOffset = await session.executeScript(() => window.pageXOffset);
      let pageYOffset = await session.executeScript(() => window.pageYOffset);
      assert.equal(pageXOffset, 200);
      assert.equal(pageYOffset, 200);
    });

    await browser.tabs.create({ url: `http://127.0.0.1:${port}#second` });
    body = await session.findElementByCSS('body');
    await body.sendKeys('\'', 'A');

    await eventually(async() => {
      let tab = (await browser.tabs.query({ active: true }))[0];
      let url = new URL(tab.url);
      assert.equal(url.hash, '#first');

      let pageXOffset = await session.executeScript(() => window.pageXOffset);
      let pageYOffset = await session.executeScript(() => window.pageYOffset);
      assert.equal(pageXOffset, 200);
      assert.equal(pageYOffset, 200);
    });
  });

  it('set a global mark and creates new tab from gone', async () => {
    await session.navigateTo(`http://127.0.0.1:${port}#first`);
    await session.executeScript(() => window.scrollTo(500, 500));
    let body = await session.findElementByCSS('body');
    await body.sendKeys('m', 'A');

    let tab = (await browser.tabs.query({ active: true }))[0];
    await browser.tabs.create({ url: `http://127.0.0.1:${port}#second` });
    await browser.tabs.remove(tab.id);

    let handles;
    await eventually(async() => {
      handles = await session.getWindowHandles();
      assert.equal(handles.length, 2);
    });
    await session.switchToWindow(handles[0]);
    await session.navigateTo(`http://127.0.0.1:${port}#second`);
    body = await session.findElementByCSS('body');
    await body.sendKeys('\'', 'A');

    await eventually(async() => {
      let tab = (await browser.tabs.query({ active: true }))[0];
      let url = new URL(tab.url);
      assert.equal(url.hash, '#first');
    });
  });
});


