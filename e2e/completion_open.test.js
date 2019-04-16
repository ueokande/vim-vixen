const express = require('express');
const lanthan = require('lanthan');
const path = require('path');
const assert = require('assert');
const eventually = require('./eventually');
const settings = require('./settings');
const Console = require('./lib/Console');

const Key = lanthan.Key;

const newApp = () => {

  let app = express();
  app.get('/', (req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <body>ok</body>
</html">`);
  });
  return app;
};

describe("completion on open/tabopen/winopen commands", () => {
  const port = 12321;
  let http;
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
    http = newApp().listen(port);

    await browser.storage.local.set({
      settings,
    });
    
    // Add item into hitories
    await session.navigateTo(`https://i-beam.org`);
  });

  after(async() => {
    http.close();
    if (firefox) {
      await firefox.close();
    }
  });

  beforeEach(async() => {
    await session.navigateTo(`http://127.0.0.1:${port}`);
    body = await session.findElementByCSS('body');
  });

  it('should show completions from search engines, bookmarks, and histories by "open" command', async() => {
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let c = new Console(session);
    await c.sendKeys('open ');

    await eventually(async() => {
      let completions = await c.getCompletions();
      assert(completions.find(x => x.type === 'title' && x.text === 'Search Engines'));
      assert(completions.find(x => x.type === 'title' && x.text === 'Bookmarks'));
      assert(completions.find(x => x.type === 'title' && x.text === 'History'));
    });
  });

  it('should filter items with URLs by keywords on "open" command', async() => {
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let c = new Console(session);
    await c.sendKeys('open https://');

    await eventually(async() => {
      let completions = await c.getCompletions();
      let items = completions.filter(x => x.type === 'item').map(x => x.text);
      assert(items.every(x => x.includes('https://')));
    });
  })

  it('should filter items with titles by keywords on "open" command', async() => {
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let c = new Console(session);
    await c.sendKeys('open getting');

    await eventually(async() => {
      let completions = await c.getCompletions();
      let items = completions.filter(x => x.type === 'item').map(x => x.text);
      assert(items.every(x => x.toLowerCase().includes('getting')));
    });
  })

  it('should filter items with titles by keywords on "tabopen" command', async() => {
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let c = new Console(session);
    await c.sendKeys('tabopen https://');

    await eventually(async() => {
      let completions = await c.getCompletions();
      let items = completions.filter(x => x.type === 'item').map(x => x.text);
      assert(items.every(x => x.includes('https://')));
    });
  })

  it('should filter items with titles by keywords on "winopen" command', async() => {
    await body.sendKeys(':');

    await session.switchToFrame(0);
    let c = new Console(session);
    await c.sendKeys('winopen https://');

    await eventually(async() => {
      let completions = await c.getCompletions();
      let items = completions.filter(x => x.type === 'item').map(x => x.text);
      assert(items.every(x => x.includes('https://')));
    });
  })
});
