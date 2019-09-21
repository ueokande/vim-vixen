const express = require('express');
const path = require('path');
const assert = require('assert');
const eventually = require('./eventually');
const { Builder } = require('lanthan');
const { By, Key } = require('selenium-webdriver');

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

describe('bdelete/bdeletes command test', () => {
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
    http.close();
    if (lanthan) {
      await lanthan.quit();
    }
  });

  beforeEach(async() => {
    let tabs = await browser.tabs.query({});
    for (let tab of tabs.slice(1)) {
      await browser.tabs.remove(tab.id);
    }
    await browser.tabs.update(tabs[0].id, { url: `http://127.0.0.1:${port}/site1`, pinned: true });
    await browser.tabs.create({ url: `http://127.0.0.1:${port}/site2`, pinned: true })
    await browser.tabs.create({ url: `http://127.0.0.1:${port}/site3`, pinned: true })
    await browser.tabs.create({ url: `http://127.0.0.1:${port}/site4` })
    await browser.tabs.create({ url: `http://127.0.0.1:${port}/site5` })

    await eventually(async() => {
      let handles = await webdriver.getAllWindowHandles();
      assert.equal(handles.length, 5);
      await webdriver.switchTo().window(handles[2]);
      await webdriver.findElement(By.css('iframe'));
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  it('should delete an unpinned tab by bdelete command', async() => {
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let input = await webdriver.findElement(By.css('input'));
    await input.sendKeys('bdelete site5', Key.ENTER);

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.deepEqual(tabs.map(t => t.url), [
        `http://127.0.0.1:${port}/site1`,
        `http://127.0.0.1:${port}/site2`,
        `http://127.0.0.1:${port}/site3`,
        `http://127.0.0.1:${port}/site4`,
      ])
    });
  });

  it('should not delete an pinned tab by bdelete command by bdelete command', async() => {
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let input = await webdriver.findElement(By.css('input'));
    await input.sendKeys('bdelete site1', Key.ENTER);

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.equal(tabs.length, 5);
    });
  });

  it('should show an error when no tabs are matched by bdelete command', async() => {
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let input = await webdriver.findElement(By.css('input'));
    await input.sendKeys('bdelete xyz', Key.ENTER);

    await eventually(async() => {
      let p = await webdriver.findElement(By.css('.vimvixen-console-error'));
      let text = await p.getText();
      assert.equal(text, 'No matching buffer for xyz');
    });
  });

  it('should show an error when more than one tabs are matched by bdelete command', async() => {
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let input = await webdriver.findElement(By.css('input'));
    await input.sendKeys('bdelete site', Key.ENTER);

    await eventually(async() => {
      let p = await webdriver.findElement(By.css('.vimvixen-console-error'));
      let text = await p.getText();
      assert.equal(text, 'More than one match for site');
    });
  });

  it('should delete an unpinned tab by bdelete! command', async() => {
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let input = await webdriver.findElement(By.css('input'));
    await input.sendKeys('bdelete! site5', Key.ENTER);

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.deepEqual(tabs.map(t => t.url), [
        `http://127.0.0.1:${port}/site1`,
        `http://127.0.0.1:${port}/site2`,
        `http://127.0.0.1:${port}/site3`,
        `http://127.0.0.1:${port}/site4`,
      ])
    });
  });

  it('should delete an pinned tab by bdelete! command', async() => {
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let input = await webdriver.findElement(By.css('input'));
    await input.sendKeys('bdelete! site1', Key.ENTER);

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.deepEqual(tabs.map(t => t.url), [
        `http://127.0.0.1:${port}/site2`,
        `http://127.0.0.1:${port}/site3`,
        `http://127.0.0.1:${port}/site4`,
        `http://127.0.0.1:${port}/site5`,
      ])
    });
  });

  it('should delete unpinned tabs by bdeletes command', async() => {
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let input = await webdriver.findElement(By.css('input'));
    await input.sendKeys('bdeletes site', Key.ENTER);

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.deepEqual(tabs.map(t => t.url), [
        `http://127.0.0.1:${port}/site1`,
        `http://127.0.0.1:${port}/site2`,
        `http://127.0.0.1:${port}/site3`,
      ])
    });
  });

  it('should delete both pinned and unpinned tabs by bdeletes! command', async() => {
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let input = await webdriver.findElement(By.css('input'));
    await input.sendKeys('bdeletes! site', Key.ENTER);

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.equal(tabs.length, 1);
    });
  });
});
