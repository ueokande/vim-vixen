const express = require('express');
const lanthan = require('lanthan');
const path = require('path');
const assert = require('assert');
const eventually = require('./eventually');

describe("options page", () => {
  let firefox;
  let session;
  let browser;

  before(async() => {
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
  });

  beforeEach(async() => {
    let tabs = await browser.tabs.query({});
    for (let tab of tabs.slice(1)) {
      await browser.tabs.remove(tab.id);
    }
  })

  it('saves current config on blur', async () => {
    let url = await browser.runtime.getURL("build/settings.html")
    await session.navigateTo(url);

    let textarea = await session.findElementByCSS('textarea');
    const updateTextarea = async(value) => {
      await session.executeScript(`document.querySelector('textarea').value = '${value}'`)
      await textarea.sendKeys(' ');
      await session.executeScript(() => document.querySelector('textarea').blur());
    }

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
});

