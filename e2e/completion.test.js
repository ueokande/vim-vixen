const express = require('express');
const lanthan = require('lanthan');
const path = require('path');
const assert = require('assert');
const eventually = require('./eventually');
const settings = require('./settings');
const Console = require('./lib/Console');

const Key = lanthan.Key;

const newApp = () => {
  let app = express();
  app.get('/', (req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <body>ok</body>
</html">`);
  });
  return app;
};

describe("general completion test", () => {
  const port = 12321;
  let http;
  let firefox;
  let session;
  let browser;
  let body;

  before(async() => {
    firefox = await lanthan.firefox({
      spy: path.join(__dirname, '..'),
      builderf: (builder) => {
        builder.addFile('build/settings.js');
      },
    });
    session = firefox.session;
    browser = firefox.browser;
    http = newApp().listen(port);

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
    await session.navigateTo(`http://127.0.0.1:${port}`);
    body = await session.findElementByCSS('body');
  });

  it('should all commands on empty line', async() => {
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let c = new Console(session);

    await eventually(async() => {
      let items = await c.getCompletions();
      assert.equal(items.length, 10);
      assert.deepEqual(items[0], { type: 'title', text: 'Console Command' });
      assert(items[1].text.startsWith('set'))
      assert(items[2].text.startsWith('open'))
      assert(items[3].text.startsWith('tabopen'))
    });
  });

  it('should only commands filtered by prefix', async() => {
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let c = new Console(session);
    await c.sendKeys('b');

    await eventually(async() => {
      let items = await c.getCompletions();
      assert.equal(items.length, 4);
      assert.deepEqual(items[0], { type: 'title', text: 'Console Command' });
      assert(items[1].text.startsWith('buffer'))
      assert(items[2].text.startsWith('bdelete'))
      assert(items[3].text.startsWith('bdeletes'))
    });
  });

  it('selects completion items by <Tab>/<S-Tab> keys', async() => {
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let c = new Console(session);
    await c.sendKeys('b');

    await eventually(async() => {
      let items = await c.getCompletions();
      assert.equal(items.length, 4);
    });

    await c.sendKeys(Key.Tab);
    await eventually(async() => {
      let items = await c.getCompletions();
      assert(items[1].highlight)

      let v = await c.currentValue();
      assert.equal(v, 'buffer');
    });

    await c.sendKeys(Key.Tab, Key.Tab);
    await eventually(async() => {
      let items = await c.getCompletions();
      assert(items[3].highlight)

      let v = await c.currentValue();
      assert.equal(v, 'bdeletes');
    });

    await c.sendKeys(Key.Tab);
    await eventually(async() => {
      let v = await c.currentValue();
      assert.equal(v, 'b');
    });

    await c.sendKeys(Key.Shift, Key.Tab);
    await eventually(async() => {
      let items = await c.getCompletions();
      assert(items[3].highlight)

      let v = await c.currentValue();
      assert.equal(v, 'bdeletes');
    });
  });
});
