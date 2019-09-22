import express from 'express';
import * as path from 'path';
import * as assert from 'assert';
import * as http from 'http';

import eventually from './eventually';
import { Builder, Lanthan } from 'lanthan';
import { WebDriver, By, Key } from 'selenium-webdriver';

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
  let http: http.Server;
  let lanthan: Lanthan;
  let webdriver: WebDriver;
  let browser: any;

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
    await browser.tabs.update(tabs[0].id, { url: `http://127.0.0.1:${port}/site1` });
    for (let i = 2; i <= 5; ++i) {
      await browser.tabs.create({ url: `http://127.0.0.1:${port}/site${i}`})
    }

    await eventually(async() => {
      let handles = await webdriver.getAllWindowHandles();
      assert.equal(handles.length, 5);
      await webdriver.switchTo().window(handles[2]);
      await webdriver.findElement(By.css('iframe'));
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  it('should do nothing by buffer command with no parameters', async() => {
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let input = await webdriver.findElement(By.css('input'));
    await input.sendKeys('buffer', Key.ENTER);

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true });
      assert.equal(tabs[0].index, 2);
    });
  });

  it('should select a tab by buffer command with a number', async() => {
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let input = await webdriver.findElement(By.css('input'));
    await input.sendKeys('buffer', Key.ENTER);

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true });
      assert.equal(tabs[0].index, 2);
    });
  });

  it('should should an out of range error by buffer commands', async() => {
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let input = await webdriver.findElement(By.css('input'));
    await input.sendKeys('buffer 0', Key.ENTER);

    await eventually(async() => {
      let p = await webdriver.findElement(By.css('.vimvixen-console-error'));
      let text = await p.getText();
      assert.equal(text, 'tab 0 does not exist');
    });

    await (webdriver.switchTo() as any).parentFrame();
    body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    input = await webdriver.findElement(By.css('input'));
    await input.sendKeys('buffer 9', Key.ENTER);

    await eventually(async() => {
      let p = await webdriver.findElement(By.css('.vimvixen-console-error'));
      let text = await p.getText();
      assert.equal(text, 'tab 9 does not exist');
    });
  });

  it('should select a tab by buffer command with a title', async() => {
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let input = await webdriver.findElement(By.css('input'));
    await input.sendKeys('buffer my_site1', Key.ENTER);

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true });
      assert.equal(tabs[0].index, 0);
    });
  });

  it('should select a tab by buffer command with an URL', async() => {
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let input = await webdriver.findElement(By.css('input'));
    await input.sendKeys('buffer /site1', Key.ENTER);

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true });
      assert.equal(tabs[0].index, 0);
    });
  });

  it('should select tabs rotately', async() => {
    let handles = await webdriver.getAllWindowHandles();
    await webdriver.switchTo().window(handles[4]);

    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let input = await webdriver.findElement(By.css('input'));
    await input.sendKeys('buffer site', Key.ENTER);

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true });
      assert.equal(tabs[0].index, 0);
    });
  });

  it('should do nothing by ":buffer %"', async() => {
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let input = await webdriver.findElement(By.css('input'));
    await input.sendKeys('buffer %', Key.ENTER);

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true });
      assert.equal(tabs[0].index, 2);
    });
  });

  it('should selects last selected tab by ":buffer #"', async() => {
    let handles = await webdriver.getAllWindowHandles();
    await webdriver.switchTo().window(handles[1]);

    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let input = await webdriver.findElement(By.css('input'));
    await input.sendKeys('buffer #', Key.ENTER);

    await eventually(async() => {
      let tabs = await browser.tabs.query({ active: true });
      assert.equal(tabs[0].index, 2);
    });
  });
});
