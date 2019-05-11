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
  <body>
    <a href="/">link1</a>
    <a href="/">link2</a>
    <a href="/">link3</a>
    <a href="/">link4</a>
    <a href="/">link5</a>
  </body>
</html">`);
  });
  return app;
};

const waitForHints = async(session) => {
  await eventually(async() => {
    let hints = await session.findElementsByCSS('.vimvixen-hint');
    assert(hints.length > 0);
  });
};

describe('follow properties test', () => {

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

    await browser.storage.local.set({ settings: {
      source: 'json',
      json: `{
        "keymaps": {
          ":": { "type": "command.show" },
          "f": { "type": "follow.start", "newTab": false },
          "F": { "type": "follow.start", "newTab": true, "background": false },
          "<C-F>": { "type": "follow.start", "newTab": true, "background": true }
        },
        "search": {
          "default": "google",
          "engines": { "google": "https://google.com/search?q={}" }
        },
        "properties": {
          "hintchars": "jk"
        }
      }`,
    }});
  });

  after(async() => {
    if (firefox) {
      await firefox.close();
    }
    http.close();
  });

  beforeEach(async() => {
    await session.navigateTo(`http://127.0.0.1:${port}/`);
    body = await session.findElementByCSS('body');
  });

  afterEach(async() => {
    let tabs = await browser.tabs.query({});
    for (let tab of tabs.slice(1)) {
      await browser.tabs.remove(tab.id);
    }
  });

  it('should show hints with hintchars by settings', async () => {
    await body.sendKeys('f');
    await eventually(async() => {
      let hints = await session.findElementsByCSS('.vimvixen-hint');
      assert.equal(hints.length, 5);

      assert.equal(await hints[0].getText(), 'J');
      assert.equal(await hints[1].getText(), 'K');
      assert.equal(await hints[2].getText(), 'JJ');
      assert.equal(await hints[3].getText(), 'JK');
      assert.equal(await hints[4].getText(), 'KJ');
    });

    await body.sendKeys('j');

    await eventually(async() => {
      let hints = await session.findElementsByCSS('.vimvixen-hint');

      assert.equal(await hints[0].getStyle('display'), 'block');
      assert.equal(await hints[1].getStyle('display'), 'none');
      assert.equal(await hints[2].getStyle('display'), 'block');
      assert.equal(await hints[3].getStyle('display'), 'block');
      assert.equal(await hints[4].getStyle('display'), 'none');

    });
  });

  it('should open tab in background by background:false', async () => {
    await body.sendKeys(Key.Shift, 'f');
    await eventually(async() => {
      let hints = await session.findElementsByCSS('.vimvixen-hint');
      assert.equal(hints.length, 5);
    });
    await body.sendKeys('jj');

    let tabs = await browser.tabs.query({});
    assert.equal(tabs[0].active, false);
    assert.equal(tabs[1].active, true);
  });

  it('should open tab in background by background:true', async () => {
    await body.sendKeys(Key.Control, 'f');
    await eventually(async() => {
      let hints = await session.findElementsByCSS('.vimvixen-hint');
      assert.equal(hints.length, 5);
    });
    await body.sendKeys('jj');

    let tabs = await browser.tabs.query({});
    assert.equal(tabs[0].active, true);
    assert.equal(tabs[1].active, false);
  });
});
