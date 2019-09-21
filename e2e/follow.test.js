const express = require('express');
const path = require('path');
const assert = require('assert');
const eventually = require('./eventually');
const { Builder } = require('lanthan');
const { Key, By } = require('selenium-webdriver');

const newApp = () => {
  let app = express();

  app.get('/', (req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <body><a href="hello">hello</a></body>
</html">`);
  });

  app.get('/follow-input', (req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <body><input></body>
</html">`);
  });

  app.get('/area', (req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <body>
    <img
      width="256" height="256"  usemap="#map"
      src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
    >
    <map name="map">
      <area shape="rect" coords="0,0,64,64" href="/">
      <area shape="rect" coords="64,64,64,64" href="/">
      <area shape="rect" coords="128,128,64,64" href="/">
    </map>
  </body>
</html">`);
  });
  
  /*
   * test case: link2 is out of the viewport
   * +-----------------+
   * |   [link1]       |<--- window
   * |                 |
   * |=================|<--- viewport
   * |   [link2]       |
   * |                 |
   * +-----------------+
   */
  app.get('/test1', (req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <body>
  <div><a href="link1">link1</a></div>
  <div style="min-height:3000px"></div>
  <div><a href="link2">link2</a></div>
  </body>
</html">`);
  });

/*
 * test case 2: link2 and link3 are out of window of the frame
 * +-----------------+
 * | +-----------+   |
 * | | [link1]   |   |
 * |=================|
 * | | [link2]   |   |
 * | +-----------+   |
 * |                 |
 * +-----------------+
 */
  app.get('/test2', (req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <body><iframe height="5000" src='/test2-frame'></body>
</html">`);
  });
  app.get('/test2-frame', (req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <body>
  <div><a href="link1">link1</a></div>
  <div style="min-height:3000px"></div>
  <div><a href="link2">link2</a></div>
  </body>
</html">`);
  });

/* test case 3: link2 is out of window of the frame
 * +-----------------+
 * | +-----------+   |
 * | | [link1]   |   |
 * | +-----------+   |
 * | : [link2]   :   |
 * | + - - - - - +   |
 * |                 |
 * +-----------------+
 */
  app.get('/test3', (req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <body><iframe src='/test3-frame'></body>
</html">`);
  });
  app.get('/test3-frame', (req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <body>
  <div><a href="link1">link1</a></div>
  <div style="min-height:3000px"></div>
  <div><a href="link2">link2</a></div>
  </body>
</html">`);
  });

  return app;
};

const waitForHints = async(webdriver) => {
  await eventually(async() => {
    let hints = await webdriver.findElements(By.css(`.vimvixen-hint`));
    assert(hints.length > 0);
  });
};

describe('follow test', () => {

  const port = 12321;
  let http;
  let lanthan;
  let webdriver;
  let browser;

  before(async() => {
    http = newApp().listen(port);
    lanthan = await Builder
      .forBrowser('firefox')
      .spyAddon(path.join(__dirname, '..'))
      .build();
    webdriver = lanthan.getWebDriver();
    browser = lanthan.getWebExtBrowser();
  });

  after(async() => {
    if (lanthan) {
      await lanthan.quit();
    }
    if (http) {
      http.close();
    }
  });

  afterEach(async() => {
    let tabs = await browser.tabs.query({});
    for (let tab of tabs.slice(1)) {
      await browser.tabs.remove(tab.id);
    }
  });

  it('should focus an input by f', async () => {
    await webdriver.navigate().to(`http://127.0.0.1:${port}/follow-input`);

    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys('f');
    await waitForHints(webdriver);
    await body.sendKeys('a');

    let tagName = await webdriver.executeScript(() => document.activeElement.tagName);
    assert.equal(tagName.toLowerCase(), 'input');
  });

  it('should open a link by f', async () => {
    await webdriver.navigate().to(`http://127.0.0.1:${port}/`);

    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys('f');
    await waitForHints(webdriver);
    await body.sendKeys('a');

    await eventually(async() => {
      let hash = await webdriver.executeScript('return location.pathname');
      assert.equal(hash, '/hello');
    });
  });

  it('should focus an input by F', async () => {
    await webdriver.navigate().to(`http://127.0.0.1:${port}/follow-input`);

    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(Key.SHIFT, 'f');
    await waitForHints(webdriver);
    await body.sendKeys('a');

    let tagName = await webdriver.executeScript(() => document.activeElement.tagName);
    assert.equal(tagName.toLowerCase(), 'input');
  });

  it('should open a link to new tab by F', async () => {
    await webdriver.navigate().to(`http://127.0.0.1:${port}/`);

    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(Key.SHIFT, 'f');
    await waitForHints(webdriver);
    await body.sendKeys('a');

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.equal(tabs.length, 2);
      assert.equal(new URL(tabs[1].url).pathname, '/hello');
      assert.equal(tabs[1].openerTabId, tabs[0].id);
    });
  });

  it('should show hints of links in area', async () => {
    await webdriver.navigate().to(`http://127.0.0.1:${port}/area`);

    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(Key.SHIFT, 'f');
    await eventually(async() => {
      let hints = await webdriver.findElements(By.css(`.vimvixen-hint`));
      assert.equal(hints.length, 3);
    });
  });

  it('should shows hints only in viewport', async () => {
    await webdriver.navigate().to(`http://127.0.0.1:${port}/test1`);

    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(Key.SHIFT, 'f');
    await eventually(async() => {
      let hints = await webdriver.findElements(By.css(`.vimvixen-hint`));
      assert.equal(hints.length, 1);
    });
  });

  it('should shows hints only in window of the frame', async () => {
    await webdriver.navigate().to(`http://127.0.0.1:${port}/test2`);

    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(Key.SHIFT, 'f');

    await webdriver.switchTo().frame(0);
    await eventually(async() => {
      let hints = await webdriver.findElements(By.css(`.vimvixen-hint`));
      assert.equal(hints.length, 1);
    });
  });

  it('should shows hints only in the frame', async () => {
    await webdriver.navigate().to(`http://127.0.0.1:${port}/test3`);

    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(Key.SHIFT, 'f');

    await webdriver.switchTo().frame(0);
    await eventually(async() => {
      let hints = await webdriver.findElements(By.css(`.vimvixen-hint`));
      assert.equal(hints.length, 1);
    });
  });
});
