const express = require('express');
const lanthan = require('lanthan');
const path = require('path');
const assert = require('assert');
const eventually = require('./eventually');
const settings = require('./settings');
const Console = require('./lib/Console');

const Key = lanthan.Key;

describe("completion on set commands", () => {
  const port = 12321;
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

    await browser.storage.local.set({
      settings,
    });
  });

  after(async() => {
    if (firefox) {
      await firefox.close();
    }
  });

  beforeEach(async() => {
    await session.navigateTo(`about:blank`);
    body = await session.findElementByCSS('body');
  });

  it('should show all property names by "set" command with empty params', async() => {
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let c = new Console(session);
    await c.sendKeys('set ');

    await eventually(async() => {
      let items = await c.getCompletions();
      assert.equal(items.length, 5);
      assert.deepEqual(items[0], { type: 'title', text: 'Properties' });
      assert(items[1].text.startsWith('hintchars'))
      assert(items[2].text.startsWith('smoothscroll'))
      assert(items[3].text.startsWith('nosmoothscroll'))
      assert(items[4].text.startsWith('complete'))
    });
  });

  it('should show filtered property names by "set" command', async() => {
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let c = new Console(session);
    await c.sendKeys('set no');

    await eventually(async() => {
      let items = await c.getCompletions();
      assert.equal(items.length, 2);
      assert(items[1].text.includes('nosmoothscroll'))
    });
  });
});
