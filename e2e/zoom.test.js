const express = require('express');
const lanthan = require('lanthan');
const path = require('path');
const assert = require('power-assert');
const eventually = require('./eventually');

const Key = lanthan.Key;

const newApp = () => {
  let app = express();
  app.get('/', (req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
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
    http = newApp().listen(port);

    firefox = await lanthan.firefox();
    await firefox.session.installAddon(path.join(__dirname, '..'));
    session = firefox.session;
    browser = firefox.browser;
    tab = (await browser.tabs.query({}))[0]
  });

  after(async() => {
    if (firefox) {
      await firefox.close();
    }
    http.close();
  });

  beforeEach(async() => {
    await session.navigateTo(`http://127.0.0.1:${port}`);
    body = await session.findElementByCSS('body');
  });

  it('should zoom in by zi', async () => {
    let before = await browser.tabs.getZoom(tab.id);
    await body.sendKeys('z', 'i');

    await eventually(async() => {
      let actual = await browser.tabs.getZoom(tab.id);
      assert(before < actual);
    });
  });

  it('should zoom out by zo', async () => {
    let before = await browser.tabs.getZoom(tab.id);
    await body.sendKeys('z', 'o');

    await eventually(async() => {
      let actual = await browser.tabs.getZoom(tab.id);
      assert(before > actual);
    });
  });

  it('scrolls left by h', async () => {
    await browser.tabs.setZoom(tab.id, 2);
    await body.sendKeys('z', 'z');

    await eventually(async() => {
      let actual = await browser.tabs.getZoom(tab.id);
      assert(actual === 1);
    });
  });
});

