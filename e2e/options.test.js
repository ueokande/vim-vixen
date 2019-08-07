const express = require('express');
const lanthan = require('lanthan');
const path = require('path');
const assert = require('assert');
const eventually = require('./eventually');

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
  let firefox;
  let session;
  let browser;

  before(async() => {
    http = newApp().listen(port);

    firefox = await lanthan.firefox({
      spy: path.join(__dirname, '..'),
      builderf: (builder) => {
        builder.addFile('build/settings.js');
        builder.addFile('build/settings.html');
      },
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

  const updateTextarea = async(value) => {
    let textarea = await session.findElementByCSS('textarea');
    await session.executeScript(`document.querySelector('textarea').value = '${value}'`)
    await textarea.sendKeys(' ');
    await session.executeScript(() => document.querySelector('textarea').blur());
  }

  it('saves current config on blur', async () => {
    let url = await browser.runtime.getURL("build/settings.html")
    await session.navigateTo(url);

    await updateTextarea(`{ "blacklist": [ "https://example.com" ] }`);

    let { settings } = await browser.storage.local.get('settings');
    assert.equal(settings.source, 'json')
    assert.equal(settings.json, '{ "blacklist": [ "https://example.com" ] } ')

    await updateTextarea(`invalid json`);

    settings = (await browser.storage.local.get('settings')).settings;
    assert.equal(settings.source, 'json')
    assert.equal(settings.json, '{ "blacklist": [ "https://example.com" ] } ')

    let error = await session.findElementByCSS('.settings-ui-input-error');
    let text = await error.getText();
    assert.ok(text.startsWith('SyntaxError:'))
  });

  it('updates keymaps without reloading', async () => {
    await browser.tabs.create({ url: `http://127.0.0.1:${port}`, active: false });
    let url = await browser.runtime.getURL("build/settings.html")
    await session.navigateTo(url);

    let handles = await session.getWindowHandles();
    await updateTextarea(`{ "keymaps": { "zz": { "type": "scroll.vertically", "count": 10 } } }`);

    await session.switchToWindow(handles[1]);

    let body = await session.findElementByCSS('body');
    await body.sendKeys('zz')

    let y = await session.executeScript(() => window.pageYOffset);
    assert.equal(y, 640);
  })
});
