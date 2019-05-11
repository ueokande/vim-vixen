const express = require('express');
const lanthan = require('lanthan');
const path = require('path');
const assert = require('assert');

const Key = lanthan.Key;

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

describe("scroll test", () => {

  const port = 12321;
  let http;
  let firefox;
  let session;
  let body;

  before(async() => {
    http = newApp().listen(port);

    firefox = await lanthan.firefox();
    await firefox.session.installAddonFromPath(path.join(__dirname, '..'));
    session = firefox.session;
  });

  after(async() => {
    if (firefox) {
      await firefox.close();
    }
    http.close();
  });

  beforeEach(async() => {
    await session.navigateTo(`http://127.0.0.1:${port}`);
    body = await session.findElementByCSS('body');
  });


  it('scrolls up by k', async () => {
    await body.sendKeys('j');

    let pageYOffset = await session.executeScript(() => window.pageYOffset);
    assert.equal(pageYOffset, 64);
  });

  it('scrolls down by j', async () => {
    await session.executeScript(() => window.scrollTo(0, 200));
    await body.sendKeys('k');

    let pageYOffset = await session.executeScript(() => window.pageYOffset);
    assert.equal(pageYOffset, 136);
  });

  it('scrolls left by h', async () => {
    await session.executeScript(() => window.scrollTo(100, 100));
    await body.sendKeys('h');

    let pageXOffset = await session.executeScript(() => window.pageXOffset);
    assert.equal(pageXOffset, 36);
  });

  it('scrolls left by l', async () => {
    await session.executeScript(() => window.scrollTo(100, 100));
    await body.sendKeys('l');

    let pageXOffset = await session.executeScript(() => window.pageXOffset);
    assert.equal(pageXOffset, 164);
  });

  it('scrolls top by gg', async () => {
    await session.executeScript(() => window.scrollTo(0, 100));
    await body.sendKeys('g', 'g');

    let pageYOffset = await session.executeScript(() => window.pageYOffset);
    assert.equal(pageYOffset, 0);
  });

  it('scrolls bottom by G', async () => {
    await session.executeScript(() => window.scrollTo(0, 100));
    await body.sendKeys(Key.Shift, 'g');

    let pageYOffset = await session.executeScript(() => window.pageYOffset);
    assert(pageYOffset > 5000);
  });

  it('scrolls bottom by 0', async () => {
    await session.executeScript(() => window.scrollTo(0, 100));
    await body.sendKeys(Key.Shift, '0');

    let pageXOffset = await session.executeScript(() => window.pageXOffset);
    assert(pageXOffset === 0);
  });

  it('scrolls bottom by $', async () => {
    await session.executeScript(() => window.scrollTo(0, 100));
    await body.sendKeys(Key.Shift, '$');

    let pageXOffset = await session.executeScript(() => window.pageXOffset);
    assert(pageXOffset > 5000);
  });

  it('scrolls bottom by <C-U>', async () => {
    await session.executeScript(() => window.scrollTo(0, 1000));
    await body.sendKeys(Key.Control, 'u');

    let pageHeight = 
      await session.executeScript(() => window.document.documentElement.clientHeight);
    let pageYOffset = await session.executeScript(() => window.pageYOffset);
    assert(Math.abs(pageYOffset - (1000 - Math.floor(pageHeight / 2))) < 5);
  });

  it('scrolls bottom by <C-D>', async () => {
    await session.executeScript(() => window.scrollTo(0, 1000));
    await body.sendKeys(Key.Control, 'd');

    let pageHeight = 
      await session.executeScript(() => window.document.documentElement.clientHeight);
    let pageYOffset = await session.executeScript(() => window.pageYOffset);
    assert(Math.abs(pageYOffset - (1000 + Math.floor(pageHeight / 2))) < 5);
  });

  it('scrolls bottom by <C-B>', async () => {
    await session.executeScript(() => window.scrollTo(0, 1000));
    await body.sendKeys(Key.Control, 'b');

    let pageHeight = 
      await session.executeScript(() => window.document.documentElement.clientHeight);
    let pageYOffset = await session.executeScript(() => window.pageYOffset);
    assert(Math.abs(pageYOffset - (1000 - pageHeight)) < 5);
  });

  it('scrolls bottom by <C-F>', async () => {
    await session.executeScript(() => window.scrollTo(0, 1000));
    await body.sendKeys(Key.Control, 'f');

    let pageHeight = 
      await session.executeScript(() => window.document.documentElement.clientHeight);
    let pageYOffset = await session.executeScript(() => window.pageYOffset);
    assert(Math.abs(pageYOffset - (1000 + pageHeight)) < 5);
  });
});
