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

describe("winopen command test", () => {
  const port = 12321;
  let http;
  let firefox;
  let session;
  let browser;
  let tab;
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
    let wins = await browser.windows.getAll();
    for (let win of wins.slice(1)) {
      await browser.windows.remove(win.id);
    }

    await session.navigateTo(`http://127.0.0.1:${port}`);
    body = await session.findElementByCSS('body');
  })

  it('should open default search for keywords by winopen command ', async() => {
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let input = await session.findElementByCSS('input');
    input.sendKeys('winopen an apple', Key.Enter);

    await eventually(async() => {
      let wins = await browser.windows.getAll();
      assert.equal(wins.length, 2);

      let tabs = await browser.tabs.query({ windowId: wins[1].id });
      let url = new URL(tabs[0].url);
      assert.equal(url.href, `http://127.0.0.1:${port}/google?q=an%20apple`)
    });
  });

  it('should open certain search page for keywords by winopen command ', async() => {
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let input = await session.findElementByCSS('input');
    input.sendKeys('winopen yahoo an apple', Key.Enter);

    await eventually(async() => {
      let wins = await browser.windows.getAll();
      assert.equal(wins.length, 2);

      let tabs = await browser.tabs.query({ windowId: wins[1].id });
      let url = new URL(tabs[0].url);
      assert.equal(url.href, `http://127.0.0.1:${port}/yahoo?q=an%20apple`)
    });
  });

  it('should open default engine with empty keywords by winopen command ', async() => {
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let input = await session.findElementByCSS('input');
    input.sendKeys('winopen', Key.Enter);

    await eventually(async() => {
      let wins = await browser.windows.getAll();
      assert.equal(wins.length, 2);

      let tabs = await browser.tabs.query({ windowId: wins[1].id });
      let url = new URL(tabs[0].url);
      assert.equal(url.href, `http://127.0.0.1:${port}/google?q=`)
    });
  });

  it('should open certain search page for empty keywords by winopen command ', async() => {
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let input = await session.findElementByCSS('input');
    input.sendKeys('winopen yahoo', Key.Enter);

    await eventually(async() => {
      let wins = await browser.windows.getAll();
      assert.equal(wins.length, 2);

      let tabs = await browser.tabs.query({ windowId: wins[1].id });
      let url = new URL(tabs[0].url);
      assert.equal(url.href, `http://127.0.0.1:${port}/yahoo?q=`)
    });
  });

  it('should open a site with domain by winopen command ', async() => {
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let input = await session.findElementByCSS('input');
    input.sendKeys('winopen i-beam.org', Key.Enter);

    await eventually(async() => {
      let wins = await browser.windows.getAll();
      assert.equal(wins.length, 2);

      let tabs = await browser.tabs.query({ windowId: wins[1].id });
      let url = new URL(tabs[0].url);
      assert.equal(url.href, 'https://i-beam.org/')
    });
  });

  it('should open a site with URL by winopen command ', async() => {
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let input = await session.findElementByCSS('input');
    input.sendKeys('winopen https://i-beam.org', Key.Enter);

    await eventually(async() => {
      let wins = await browser.windows.getAll();
      assert.equal(wins.length, 2);

      let tabs = await browser.tabs.query({ windowId: wins[1].id });
      let url = new URL(tabs[0].url);
      assert.equal(url.href, 'https://i-beam.org/')
    });
  });
});
