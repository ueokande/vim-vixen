const express = require('express');
const lanthan = require('lanthan');
const path = require('path');
const assert = require('assert');
const eventually = require('./eventually');

const Key = lanthan.Key;

const newApp = () => {
  let app = express();
  app.get('/pagenation-a/:page', (req, res) => {
    res.status(200).send(`
<html lang="en">
  <a href="/pagenation-a/${Number(req.params.page) - 1}">prev</a>
  <a href="/pagenation-a/${Number(req.params.page) + 1}">next</a>
</html">`);
  });
  app.get('/pagenation-link/:page', (req, res) => {
    res.status(200).send(`
<html lang="en">
  <head>
    <link rel="prev" href="/pagenation-link/${Number(req.params.page) - 1}"></link>
    <link rel="next" href="/pagenation-link/${Number(req.params.page) + 1}"></link>
  </head>
</html">`);
  });
  app.get('/reload', (req, res) => {
    res.status(200).send(`
<html lang="en">
  <head>
    <script>window.location.hash = Date.now()</script>
  </head>
  <body style="width:10000px; height:10000px"></body>
</html">`);
  });

  app.get('/*', (req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  ${req.path}
</html">`);
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
      prefs: {
        'browser.startup.homepage': `http://127.0.0.1:${port}#home`,
      }
    });
    await firefox.session.installAddonFromPath(path.join(__dirname, '..'));
    session = firefox.session;
    browser = firefox.browser;
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

  it('should go to parent path without hash by gu', async () => {
    await session.navigateTo(`http://127.0.0.1:${port}/a/b/c`);
    let body = await session.findElementByCSS('body');

    await body.sendKeys('g', 'u');

    await eventually(async() => {
      let tab = (await browser.tabs.query({}))[0];
      let url = new URL(tab.url);
      assert.equal(url.pathname, `/a/b/`)
    });
  });

  it('should remove hash by gu', async () => {
    await session.navigateTo(`http://127.0.0.1:${port}/a/b/c#hash`);
    let body = await session.findElementByCSS('body');

    await body.sendKeys('g', 'u');

    await eventually(async() => {
      let tab = (await browser.tabs.query({}))[0];
      let url = new URL(tab.url);
      assert.equal(url.hash, '')
      assert.equal(url.pathname, `/a/b/c`)
    });
  });

  it('should go to root path by gU', async () => {
    await session.navigateTo(`http://127.0.0.1:${port}/a/b/c#hash`);
    let body = await session.findElementByCSS('body');

    await body.sendKeys('g', Key.Shift, 'u');

    await eventually(async() => {
      let tab = (await browser.tabs.query({}))[0];
      let url = new URL(tab.url);
      assert.equal(url.pathname, `/`)
    });
  });

  it('should go back and forward in history by H and L', async () => {
    await session.navigateTo(`http://127.0.0.1:${port}/first`);
    await session.navigateTo(`http://127.0.0.1:${port}/second`);
    let body = await session.findElementByCSS('body');

    await body.sendKeys(Key.Shift, 'h');

    await eventually(async() => {
      let tab = (await browser.tabs.query({}))[0];
      let url = new URL(tab.url);
      assert.equal(url.pathname, `/first`)
    });

    body = await session.findElementByCSS('body');
    await body.sendKeys(Key.Shift, 'l');

    await eventually(async() => {
      tab = (await browser.tabs.query({}))[0];
      url = new URL(tab.url);
      assert.equal(url.pathname, `/second`)
    });
  });

  it('should go previous and next page in <a> by [[ and ]]', async () => {
    await session.navigateTo(`http://127.0.0.1:${port}/pagenation-a/10`);

    let body = await session.findElementByCSS('body');
    await body.sendKeys('[', '[');

    await eventually(async() => {
      let tab = (await browser.tabs.query({}))[0];
      let url = new URL(tab.url);
      assert.equal(url.pathname, '/pagenation-a/9');
    });
  });

  it('should go next page in <a> by ]]', async () => {
    await session.navigateTo(`http://127.0.0.1:${port}/pagenation-a/10`);
    let body = await session.findElementByCSS('body');
    await body.sendKeys(']', ']');

    await eventually(async() => {
      let tab = (await browser.tabs.query({}))[0];
      let url = new URL(tab.url);
      assert.equal(url.pathname, '/pagenation-a/11');
    });
  });

  it('should go previous page in <link> by ]]', async () => {
    await session.navigateTo(`http://127.0.0.1:${port}/pagenation-link/10`);

    let body = await session.findElementByCSS('body');
    await body.sendKeys('[', '[');

    await eventually(async() => {
      let tab = (await browser.tabs.query({}))[0];
      let url = new URL(tab.url);
      assert.equal(url.pathname, '/pagenation-link/9');
    });
  });

  it('should go next page by in <link> by [[', async () => {
    await session.navigateTo(`http://127.0.0.1:${port}/pagenation-link/10`);
    let body = await session.findElementByCSS('body');
    await body.sendKeys(']', ']');

    await eventually(async() => {
      let tab = (await browser.tabs.query({}))[0];
      let url = new URL(tab.url);
      assert.equal(url.pathname, '/pagenation-link/11');
    });
  });

  it('should go to home page into current tab by gh', async () => {
    await session.navigateTo(`http://127.0.0.1:${port}`);
    let body = await session.findElementByCSS('body');
    await body.sendKeys('g', 'h');

    await eventually(async() => {
      let tab = (await browser.tabs.query({}))[0];
      let url = new URL(tab.url);
      assert.equal(url.hash, '#home');
    });
  });

  it('should go to home page into current tab by gH', async () => {
    await session.navigateTo(`http://127.0.0.1:${port}`);
    let body = await session.findElementByCSS('body');
    await body.sendKeys('g', Key.Shift, 'H');

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.equal(tabs.length, 2);
      assert.equal(new URL(tabs[0].url).hash, '');
      assert.equal(new URL(tabs[1].url).hash, '#home');
      assert.equal(tabs[1].active, true);
    });
  });

  it('should reload current tab by r', async () => {
    await session.navigateTo(`http://127.0.0.1:${port}/reload`);
    await session.executeScript(() => window.scrollTo(500, 500));
    let before
    await eventually(async() => {
      let tab = (await browser.tabs.query({}))[0];
      before = Number(new URL(tab.url).hash.split('#')[1]);
      assert(before > 0);
    });

    let body = await session.findElementByCSS('body');
    await body.sendKeys('r');

    let after
    await eventually(async() => {
      let tab = (await browser.tabs.query({}))[0];
      after = Number(new URL(tab.url).hash.split('#')[1]);
      assert(after > before);
    });

    await eventually(async() => {
      let pageYOffset = await session.executeScript(() => window.pageYOffset);
      assert.equal(pageYOffset, 500);
    });
  });

  it('should reload current tab without cache by R', async () => {
    await session.navigateTo(`http://127.0.0.1:${port}/reload`);
    await session.executeScript(() => window.scrollTo(500, 500));
    let before
    await eventually(async() => {
      let tab = (await browser.tabs.query({}))[0];
      before = Number(new URL(tab.url).hash.split('#')[1]);
      assert(before > 0);
    });

    let body = await session.findElementByCSS('body');
    await body.sendKeys(Key.Shift, 'R');

    let after
    await eventually(async() => {
      let tab = (await browser.tabs.query({}))[0];
      after = Number(new URL(tab.url).hash.split('#')[1]);
      assert(after > before);
    });

    // assert that the page offset is reset to 0, and 'eventually' is timed-out.
    await assert.rejects(async () => {
      await eventually(async() => {
        let pageYOffset = await session.executeScript(() => window.pageYOffset);
        assert.equal(pageYOffset, 500);
      });
    });
  });
});
