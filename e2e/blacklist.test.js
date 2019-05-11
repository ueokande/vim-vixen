const express = require('express');
const lanthan = require('lanthan');
const path = require('path');
const assert = require('assert');
const settings = require('./settings');

const newApp = () => {
  let app = express();
  app.get('/*', (req, res) => {
    res.status(200).send(`<!DOCTYPEhtml>
<html lang="en">
  <body style="width:10000px; height:10000px"></body>
</html>`);
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
      builderf: (builder) => {
        builder.addFile('build/settings.js');
      },
    });
    session = firefox.session;
    browser = firefox.browser;
  });

  after(async() => {
    if (firefox) {
      await firefox.close();
    }
    http.close();
  });

  it('should disable add-on if the URL is in the blacklist', async () => {
    await browser.storage.local.set({
      settings: {
        source: 'json',
        json: `{
        "keymaps": {
          "j": { "type": "scroll.vertically", "count": 1 }
        },
        "blacklist": [ "127.0.0.1:${port}/a" ]
      }`,
      },
    });

    await session.navigateTo(`http://127.0.0.1:${port}/a`);

    let body = await session.findElementByCSS('body');
    await body.sendKeys('j');

    // not works
    let pageYOffset = await session.executeScript(() => window.pageYOffset);
    assert.equal(pageYOffset, 0);

    await session.navigateTo(`http://127.0.0.1:${port}/ab`);
    body = await session.findElementByCSS('body');
    await body.sendKeys('j');

    // works
    pageYOffset = await session.executeScript(() => window.pageYOffset);
    assert.equal(pageYOffset, 64);
  });
});

