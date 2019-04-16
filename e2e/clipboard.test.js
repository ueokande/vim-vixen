const express = require('express');
const lanthan = require('lanthan');
const path = require('path');
const assert = require('assert');
const eventually = require('./eventually');
const clipboard = require('./lib/clipboard');
const settings = require('./settings');

const Key = lanthan.Key;

const newApp = () => {
  let app = express();
  app.get('/', (req, res) => {
    res.status(200).send(`<html lang="en"></html">`);
  });
  return app;
};

describe("navigate test", () => {

  const port = 12321;
  let http;
  let firefox;
  let session;
  let browser;

  before(async() => {
    http = newApp().listen(port);

    firefox = await lanthan.firefox({
      spy: path.join(__dirname, '..'),
    });
    session = firefox.session;
    browser = firefox.browser;

    await browser.storage.local.set({
      settings,
    });
  });

  after(async() => {
    if (firefox) {
      await firefox.close();
    }
    http.close();
  });

  beforeEach(async() => {
    let tabs = await browser.tabs.query({});
    for (let tab of tabs.slice(1)) {
      await browser.tabs.remove(tab.id);
    }
  })

  it('should copy current URL by y', async () => {
    await session.navigateTo(`http://127.0.0.1:${port}/#should_copy_url`);
    let body = await session.findElementByCSS('body');

    await body.sendKeys('y');
    await eventually(async() => {
      let data = await clipboard.read();
      assert.equal(data, `http://127.0.0.1:${port}/#should_copy_url`);
    });
  });

  it('should open an URL from clipboard by p', async () => {
    await session.navigateTo(`http://127.0.0.1:${port}/`);
    let body = await session.findElementByCSS('body');

    await clipboard.write(`http://127.0.0.1:${port}/#open_from_clipboard`);
    await body.sendKeys('p');

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true });
      assert.equal(tabs[0].url, `http://127.0.0.1:${port}/#open_from_clipboard`);
    });
  });

  it('should open an URL from clipboard to new tab by P', async () => {
    await session.navigateTo(`http://127.0.0.1:${port}/`);
    let body = await session.findElementByCSS('body');

    await clipboard.write(`http://127.0.0.1:${port}/#open_to_new_tab`);
    await body.sendKeys(Key.Shift, 'p');

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.deepEqual(tabs.map(t => t.url), [
        `http://127.0.0.1:${port}/`,
        `http://127.0.0.1:${port}/#open_to_new_tab`,
      ]);
    });
  });

  it('should open search result with keywords in clipboard by p', async () => {
    await session.navigateTo(`http://127.0.0.1:${port}/`);
    let body = await session.findElementByCSS('body');

    await clipboard.write(`an apple`);
    await body.sendKeys('p');

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.equal(tabs[0].url, `http://127.0.0.1:${port}/google?q=an%20apple`);
    });
  });

  it('should open search result with keywords in clipboard to new tabby P', async () => {
    await session.navigateTo(`http://127.0.0.1:${port}/`);
    let body = await session.findElementByCSS('body');

    await clipboard.write(`an apple`);
    await body.sendKeys(Key.Shift, 'p');

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.deepEqual(tabs.map(t => t.url), [
        `http://127.0.0.1:${port}/`,
        `http://127.0.0.1:${port}/google?q=an%20apple`,
      ]);
    });
  });
});
