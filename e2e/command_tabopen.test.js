const express = require('express');
const lanthan = require('lanthan');
const path = require('path');
const assert = require('assert');
const eventually = require('./eventually');
const settings = require('./settings');

const Key = lanthan.Key;

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

describe("tabopen command test", () => {
  const port = 12321;
  let http;
  let firefox;
  let session;
  let browser;
  let body;

  before(async() => {
    http = newApp().listen(port);

    firefox = await lanthan.firefox({
      spy: path.join(__dirname, '..'),
      builderf: (builder) => {
        builder.addFile('build/settings.js');
      },
    });
    session = firefox.session;
    browser = firefox.browser;
    await browser.storage.local.set({
      settings,
    });
  });

  after(async() => {
    http.close();
    if (firefox) {
      await firefox.close();
    }
  });

  beforeEach(async() => {
    let tabs = await browser.tabs.query({});
    for (let tab of tabs.slice(1)) {
      await browser.tabs.remove(tab.id);
    }

    await session.navigateTo(`http://127.0.0.1:${port}`);
    body = await session.findElementByCSS('body');
  })

  it('should open default search for keywords by tabopen command ', async() => {
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let input = await session.findElementByCSS('input');
    input.sendKeys('tabopen an apple', Key.Enter);

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.equal(tabs.length, 2);
      let url = new URL(tabs[1].url);
      assert.equal(url.href, `http://127.0.0.1:${port}/google?q=an%20apple`)
    });
  });

  it('should open certain search page for keywords by tabopen command ', async() => {
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let input = await session.findElementByCSS('input');
    input.sendKeys('tabopen yahoo an apple', Key.Enter);

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.equal(tabs.length, 2);
      let url = new URL(tabs[1].url);
      assert.equal(url.href, `http://127.0.0.1:${port}/yahoo?q=an%20apple`)
    });
  });

  it('should open default engine with empty keywords by tabopen command ', async() => {
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let input = await session.findElementByCSS('input');
    input.sendKeys('tabopen', Key.Enter);

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.equal(tabs.length, 2);
      let url = new URL(tabs[1].url);
      assert.equal(url.href, `http://127.0.0.1:${port}/google?q=`)
    });
  });

  it('should open certain search page for empty keywords by tabopen command ', async() => {
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let input = await session.findElementByCSS('input');
    input.sendKeys('tabopen yahoo', Key.Enter);

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.equal(tabs.length, 2);
      let url = new URL(tabs[1].url);
      assert.equal(url.href, `http://127.0.0.1:${port}/yahoo?q=`)
    });
  });

  it('should open a site with domain by tabopen command ', async() => {
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let input = await session.findElementByCSS('input');
    input.sendKeys('tabopen i-beam.org', Key.Enter);

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.equal(tabs.length, 2);
      let url = new URL(tabs[1].url);
      assert.equal(url.href, 'https://i-beam.org/')
    });
  });

  it('should open a site with URL by tabopen command ', async() => {
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let input = await session.findElementByCSS('input');
    input.sendKeys('tabopen https://i-beam.org', Key.Enter);

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.equal(tabs.length, 2);
      let url = new URL(tabs[1].url);
      assert.equal(url.href, 'https://i-beam.org/')
    });
  });
});
