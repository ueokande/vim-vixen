const express = require('express');
const path = require('path');
const assert = require('assert');
const eventually = require('./eventually');
const { Builder } = require('lanthan');
const { By } = require('selenium-webdriver');

const newApp = () => {
  let app = express();
  app.get('/', (req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <body style="width:10000px; height:10000px"></body>
</html">`);
  });
  return app;
};

describe("options page", () => {
  const port = 12321;
  let http;
  let lanthan;
  let session;
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

  beforeEach(async() => {
    let tabs = await browser.tabs.query({});
    for (let tab of tabs.slice(1)) {
      await browser.tabs.remove(tab.id);
    }
  })

  const updateTextarea = async(value) => {
    let textarea = await webdriver.findElement(By.css('textarea'));
    await webdriver.executeScript(`document.querySelector('textarea').value = '${value}'`)
    await textarea.sendKeys(' ');
    await webdriver.executeScript(() => document.querySelector('textarea').blur());
  }

  it('saves current config on blur', async () => {
    let url = await browser.runtime.getURL("build/settings.html")
    await webdriver.navigate().to(url);

    await updateTextarea(`{ "blacklist": [ "https://example.com" ] }`);

    let { settings } = await browser.storage.local.get('settings');
    assert.equal(settings.source, 'json')
    assert.equal(settings.json, '{ "blacklist": [ "https://example.com" ] } ')

    await updateTextarea(`invalid json`);

    settings = (await browser.storage.local.get('settings')).settings;
    assert.equal(settings.source, 'json')
    assert.equal(settings.json, '{ "blacklist": [ "https://example.com" ] } ')

    let error = await webdriver.findElement(By.css('.settings-ui-input-error'));
    let text = await error.getText();
    assert.ok(text.startsWith('SyntaxError:'))
  });

  it('updates keymaps without reloading', async () => {
    await browser.tabs.create({ url: `http://127.0.0.1:${port}`, active: false });
    let url = await browser.runtime.getURL("build/settings.html")
    await webdriver.navigate().to(url);

    await updateTextarea(`{ "keymaps": { "zz": { "type": "scroll.vertically", "count": 10 } } }`);

    let handles = await webdriver.getAllWindowHandles();
    await webdriver.switchTo().window(handles[1]);

    let body = await webdriver.findElement(By.css('body'));
    await body.sendKeys('zz')

    let y = await webdriver.executeScript(() => window.pageYOffset);
    assert.equal(y, 640);
  })
});
