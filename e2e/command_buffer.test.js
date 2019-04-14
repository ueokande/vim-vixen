const express = require('express');
const lanthan = require('lanthan');
const path = require('path');
const assert = require('assert');
const eventually = require('./eventually');

const Key = lanthan.Key;

const newApp = () => {
  let app = express();
  app.get('/*', (req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <head>
    <title>my_${req.path.slice(1)}</title>
  </head>
  <body><h1>${req.path}</h1></body>
</html">`);
  });
  return app;
};

describe('buffer command test', () => {
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
    let tabs = await browser.tabs.query({});
    for (let tab of tabs.slice(1)) {
      await browser.tabs.remove(tab.id);
    }
    await browser.tabs.update(tabs[0].id, { url: `http://127.0.0.1:${port}/site1` });
    for (let i = 2; i <= 5; ++i) {
      await browser.tabs.create({ url: `http://127.0.0.1:${port}/site${i}`})
    }

    await eventually(async() => {
      let handles = await session.getWindowHandles();
      assert.equal(handles.length, 5);
      await session.switchToWindow(handles[2]);
      await session.findElementByCSS('iframe');
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  it('should do nothing by buffer command with no parameters', async() => {
    let body = await session.findElementByCSS('body');
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let input = await session.findElementByCSS('input');
    await input.sendKeys('buffer', Key.Enter);

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true });
      assert.equal(tabs[0].index, 2);
    });
  });

  it('should select a tab by buffer command with a number', async() => {
    let body = await session.findElementByCSS('body');
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let input = await session.findElementByCSS('input');
    await input.sendKeys('buffer', Key.Enter);

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true });
      assert.equal(tabs[0].index, 2);
    });
  });

  it('should should an out of range error by buffer commands', async() => {
    let body = await session.findElementByCSS('body');
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let input = await session.findElementByCSS('input');
    await input.sendKeys('buffer 0', Key.Enter);

    await eventually(async() => {
      let p = await session.findElementByCSS('.vimvixen-console-error');
      let text = await p.getText();
      assert.equal(text, 'tab 0 does not exist');
    });

    await session.switchToParentFrame();
    body = await session.findElementByCSS('body');
    await body.sendKeys(':');

    await session.switchToFrame(0);
    input = await session.findElementByCSS('input');
    await input.sendKeys('buffer 9', Key.Enter);

    await eventually(async() => {
      let p = await session.findElementByCSS('.vimvixen-console-error');
      let text = await p.getText();
      assert.equal(text, 'tab 9 does not exist');
    });
  });

  it('should select a tab by buffer command with a title', async() => {
    let body = await session.findElementByCSS('body');
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let input = await session.findElementByCSS('input');
    await input.sendKeys('buffer my_site1', Key.Enter);

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true });
      assert.equal(tabs[0].index, 0);
    });
  });

  it('should select a tab by buffer command with an URL', async() => {
    let body = await session.findElementByCSS('body');
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let input = await session.findElementByCSS('input');
    await input.sendKeys('buffer /site1', Key.Enter);

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true });
      assert.equal(tabs[0].index, 0);
    });
  });

  it('should select tabs rotately', async() => {
    let handles = await session.getWindowHandles();
    await session.switchToWindow(handles[4]);

    let body = await session.findElementByCSS('body');
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let input = await session.findElementByCSS('input');
    await input.sendKeys('buffer site', Key.Enter);

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true });
      assert.equal(tabs[0].index, 0);
    });
  });

  it('should do nothing by ":buffer %"', async() => {
    let body = await session.findElementByCSS('body');
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let input = await session.findElementByCSS('input');
    await input.sendKeys('buffer %', Key.Enter);

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true });
      assert.equal(tabs[0].index, 2);
    });
  });

  it('should selects last selected tab by ":buffer #"', async() => {
    let handles = await session.getWindowHandles();
    await session.switchToWindow(handles[1]);

    let body = await session.findElementByCSS('body');
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let input = await session.findElementByCSS('input');
    await input.sendKeys('buffer #', Key.Enter);

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true });
      assert.equal(tabs[0].index, 2);
    });
  });
});
