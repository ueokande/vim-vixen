import express from 'express';
import * as path from 'path';
import * as assert from 'assert';
import * as http from 'http';

import settings from './settings';
import eventually from './eventually';
import { Builder, Lanthan } from 'lanthan';
import { WebDriver } from 'selenium-webdriver';
import Page from './lib/Page';

const newApp = () => {

  let app = express();
  app.get('/*', (req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <head>
    <title>title_${req.path.slice(1)}</title>
  </head>
  <body><h1>home</h1></body>
</html">`);
  });
  return app;
};

describe("completion on buffer/bdelete/bdeletes", () => {
  const port = 12321;
  let http: http.Server;
  let lanthan: Lanthan;
  let webdriver: WebDriver;
  let browser: any;
  let page: Page;

  before(async() => {
    lanthan = await Builder
      .forBrowser('firefox')
      .spyAddon(path.join(__dirname, '..'))
      .build();
    webdriver = lanthan.getWebDriver();
    browser = lanthan.getWebExtBrowser();
    http = newApp().listen(port);

    await browser.storage.local.set({
      settings,
    });
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
    for (let i = 3; i <= 5; ++i) {
      await browser.tabs.create({ url: `http://127.0.0.1:${port}/site${i}` })
    }

    await eventually(async() => {
      let handles = await webdriver.getAllWindowHandles();
      assert.equal(handles.length, 5);
      await webdriver.switchTo().window(handles[2]);
    });

    page = await Page.currentContext(webdriver);
  });

  it('should all tabs by "buffer" command with empty params', async() => {
    let console = await page.showConsole();
    await console.inputKeys('buffer ');

    await eventually(async() => {
      let items = await console.getCompletions();
      assert.equal(items.length, 6);
      assert.deepEqual(items[0], { type: 'title', text: 'Buffers' });
      assert.ok(items[1].text.startsWith('1:'));
      assert.ok(items[2].text.startsWith('2:'));
      assert.ok(items[3].text.startsWith('3:'));
      assert.ok(items[4].text.startsWith('4:'));
      assert.ok(items[5].text.startsWith('5:'));

      assert.ok(items[3].text.includes('%'));
      assert.ok(items[5].text.includes('#'));
    });
  })

  it('should filter items with URLs by keywords on "buffer" command', async() => {
    let console = await page.showConsole();
    await console.inputKeys('buffer title_site2');

    await eventually(async() => {
      let items = await console.getCompletions();
      assert.deepEqual(items[0], { type: 'title', text: 'Buffers' });
      assert.ok(items[1].text.startsWith('2:'));
      assert.ok(items[1].text.includes('title_site2'));
      assert.ok(items[1].text.includes(`http://127.0.0.1:${port}/site2`));
    });
  })

  it('should filter items with titles by keywords on "buffer" command', async() => {
    let console = await page.showConsole();
    await console.inputKeys('buffer /site2');

    await eventually(async() => {
      let items = await console.getCompletions();
      assert.deepEqual(items[0], { type: 'title', text: 'Buffers' });
      assert.ok(items[1].text.startsWith('2:'));
    });
  })

  it('should show one item by number on "buffer" command', async() => {
    let console = await page.showConsole();
    await console.inputKeys('buffer 2');

    await eventually(async() => {
      let items = await console.getCompletions();
      assert.equal(items.length, 2);
      assert.deepEqual(items[0], { type: 'title', text: 'Buffers' });
      assert.ok(items[1].text.startsWith('2:'));
    });
  })

  it('should show unpinned tabs "bdelete" command', async() => {
    let console = await page.showConsole();
    await console.inputKeys('bdelete site');

    await eventually(async() => {
      let items = await console.getCompletions();
      assert.equal(items.length, 4);
      assert.ok(items[1].text.includes('site3'));
      assert.ok(items[2].text.includes('site4'));
      assert.ok(items[3].text.includes('site5'));
    });
  })

  it('should show unpinned tabs "bdeletes" command', async() => {
    let console = await page.showConsole();
    await console.inputKeys('bdeletes site');

    await eventually(async() => {
      let items = await console.getCompletions();
      assert.equal(items.length, 4);
      assert.ok(items[1].text.includes('site3'));
      assert.ok(items[2].text.includes('site4'));
      assert.ok(items[3].text.includes('site5'));
    });
  })

  it('should show both pinned and unpinned tabs "bdelete!" command', async() => {
    let console = await page.showConsole();
    await console.inputKeys('bdelete! site');

    await eventually(async() => {
      let items = await console.getCompletions();
      assert.equal(items.length, 6);
      assert.ok(items[1].text.includes('site1'));
      assert.ok(items[2].text.includes('site2'));
      assert.ok(items[3].text.includes('site3'));
      assert.ok(items[4].text.includes('site4'));
      assert.ok(items[5].text.includes('site5'));
    });
  })

  it('should show both pinned and unpinned tabs "bdeletes!" command', async() => {
    let console = await page.showConsole();
    await console.inputKeys('bdeletes! site');

    await eventually(async() => {
      let items = await console.getCompletions();
      assert.equal(items.length, 6);
      assert.ok(items[1].text.includes('site1'));
      assert.ok(items[2].text.includes('site2'));
      assert.ok(items[3].text.includes('site3'));
      assert.ok(items[4].text.includes('site4'));
      assert.ok(items[5].text.includes('site5'));
    });
  })
});
