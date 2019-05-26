const express = require('express');
const lanthan = require('lanthan');
const path = require('path');
const assert = require('assert');
const eventually = require('./eventually');

const Key = lanthan.Key;

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
  let firefox;
  let session;
  let browser;
  let tabs;

  before(async() => {
    firefox = await lanthan.firefox();
    await firefox.session.installAddonFromPath(path.join(__dirname, '..'));
    session = firefox.session;
    browser = firefox.browser;
    http = newApp().listen(port);

    await session.navigateTo(`${url}`);
  });

  after(async() => {
    http.close();
    if (firefox) {
      await firefox.close();
    }
  });

  it('repeats last operation', async () => {
    let before = await browser.tabs.query({});

    let body = await session.findElementByCSS('body');
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let input = await session.findElementByCSS('input');
    input.sendKeys(`tabopen ${url}newtab`, Key.Enter);

    await eventually(async() => {
      let current = await browser.tabs.query({ url: `*://*/newtab` });
      assert.equal(current.length, 1);
    });

    body = await session.findElementByCSS('body');
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

    let body = await session.findElementByCSS('body');
    await body.sendKeys('d');

    await eventually(async() => {
      let current = await browser.tabs.query({});
      assert.equal(current.length,  before.length - 1);
    });

    await browser.tabs.update(before[2].id, { active: true });
    body = await session.findElementByCSS('body');
    await body.sendKeys('.');

    await eventually(async() => {
      let current = await browser.tabs.query({});
      assert.equal(current.length, before.length - 2);
    });
  });
});
