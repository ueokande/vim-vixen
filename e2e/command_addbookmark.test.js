const express = require('express');
const lanthan = require('lanthan');
const path = require('path');
const assert = require('assert');
const eventually = require('./eventually');

const Key = lanthan.Key;

const newApp = () => {
  let app = express();
  app.get('/happy', (req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <head>
    <title>how to be happy</title>
  </head>
</html">`);
  });
  return app;
};

describe('addbookmark command test', () => {
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
    http.close();
    if (firefox) {
      await firefox.close();
    }
  });

  beforeEach(async() => {
    await session.navigateTo(`http://127.0.0.1:${port}/happy`);
  });

  it('should add a bookmark from the current page', async() => {
    let body = await session.findElementByCSS('body');
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let input = await session.findElementByCSS('input');
    await input.sendKeys('addbookmark how to be happy', Key.Enter);

    await eventually(async() => {
      var bookmarks = await browser.bookmarks.search({ title: 'how to be happy' });
      assert.equal(bookmarks.length, 1);
      assert.equal(bookmarks[0].url, `http://127.0.0.1:${port}/happy`);
    });
  });
});
