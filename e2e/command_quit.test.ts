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

describe('quit/quitall command test', () => {
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

  it('should current tab by q command', async() => {
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let input = await webdriver.findElement(By.css('input'));
    await input.sendKeys('q', Key.ENTER);

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.equal(tabs.length, 4)
    });
  });

  it('should current tab by quit command', async() => {
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let input = await webdriver.findElement(By.css('input'));
    await input.sendKeys('quit', Key.ENTER);

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.equal(tabs.length, 4)
    });
  });

  it('should current tab by qa command', async() => {
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let input = await webdriver.findElement(By.css('input'));
    await input.sendKeys('qa', Key.ENTER);

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.equal(tabs.length, 1)
    });
  });

  it('should current tab by quitall command', async() => {
    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let input = await webdriver.findElement(By.css('input'));
    await input.sendKeys('quitall', Key.ENTER);

    await eventually(async() => {
      let tabs = await browser.tabs.query({});
      assert.equal(tabs.length, 1)
    });
  });
});
