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
  app.get('/', (_req, res) => {
    res.send(`<!DOCTYPEhtml>
<html lang="en">
  <body>ok</body>
</html">`);
  });
  return app;
};

describe("completion on open/tabopen/winopen commands", () => {
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
    
    // Add item into hitories
    await webdriver.navigate().to(`https://i-beam.org/404`);
  });

  after(async() => {
    http.close();
    if (lanthan) {
      await lanthan.quit();
    }
  });

  beforeEach(async() => {
    page = await Page.navigateTo(webdriver, `http://127.0.0.1:${port}`);
  });

  it('should show completions from search engines, bookmarks, and histories by "open" command', async() => {
    let console = await page.showConsole();
    await console.inputKeys('open ');

    await eventually(async() => {
      let completions = await console.getCompletions();
      assert.ok(completions.find(x => x.type === 'title' && x.text === 'Search Engines'));
      assert.ok(completions.find(x => x.type === 'title' && x.text === 'Bookmarks'));
      assert.ok(completions.find(x => x.type === 'title' && x.text === 'History'));
    });
  });

  it('should filter items with URLs by keywords on "open" command', async() => {
    let console = await page.showConsole();
    await console.inputKeys('open https://');

    await eventually(async() => {
      let completions = await console.getCompletions();
      let items = completions.filter(x => x.type === 'item').map(x => x.text);
      assert.ok(items.every(x => x.includes('https://')));
    });
  })

  it('should filter items with titles by keywords on "open" command', async() => {
    let console = await page.showConsole();
    await console.inputKeys('open getting');

    await eventually(async() => {
      let completions = await console.getCompletions();
      let items = completions.filter(x => x.type === 'item').map(x => x.text);
      assert.ok(items.every(x => x.toLowerCase().includes('getting')));
    });
  })

  it('should filter items with titles by keywords on "tabopen" command', async() => {
    let console = await page.showConsole();
    await console.inputKeys('tabopen getting');

    await eventually(async() => {
      let completions = await console.getCompletions();
      let items = completions.filter(x => x.type === 'item').map(x => x.text);
      assert.ok(items.every(x => x.includes('https://')));
    });
  })

  it('should filter items with titles by keywords on "winopen" command', async() => {
    let console = await page.showConsole();
    await console.inputKeys('winopen https://');

    await eventually(async() => {
      let completions = await console.getCompletions();
      let items = completions.filter(x => x.type === 'item').map(x => x.text);
      assert.ok(items.every(x => x.includes('https://')));
    });
  })

  it('should display only specified items in "complete" property by set command', async() => {
    let console = await page.showConsole();
    await console.execCommand('set complete=sbh');
    await (webdriver.switchTo() as any).parentFrame();

    console = await page.showConsole();
    await console.inputKeys('open ');

    await eventually(async() => {
      let completions = await console.getCompletions();
      let titles = completions.filter(x => x.type === 'title').map(x => x.text);
      assert.deepEqual(titles, ['Search Engines', 'Bookmarks', 'History'])
    });

    await console.close();
    console = await page.showConsole();
    await console.execCommand('set complete=bss');
    await (webdriver.switchTo() as any).parentFrame();

    console = await page.showConsole();
    await console.inputKeys('open ');

    await eventually(async() => {
      let completions = await console.getCompletions();
      let titles = completions.filter(x => x.type === 'title').map(x => x.text);
      assert.deepEqual(titles, ['Bookmarks', 'Search Engines', 'Search Engines'])
    });
  })

  it('should display only specified items in "complete" property by setting', async() => {
    await browser.storage.local.set({ settings: {
      source: 'json',
      json: `{
        "keymaps": {
          ":": { "type": "command.show" }
        },
        "search": {
          "default": "google",
          "engines": { "google": "https://google.com/search?q={}" }
        },
        "properties": {
          "complete": "sbh"
        }
      }`,
    }});

    let console = await page.showConsole();
    await console.inputKeys('open ');

    await eventually(async() => {
      let completions = await console.getCompletions();
      let titles = completions.filter(x => x.type === 'title').map(x => x.text);
      assert.deepEqual(titles, ['Search Engines', 'Bookmarks', 'History'])
    });

    await console.close();
    await (webdriver.switchTo() as any).parentFrame();

    await browser.storage.local.set({ settings: {
      source: 'json',
      json: `{
        "keymaps": {
          ":": { "type": "command.show" }
        },
        "search": {
          "default": "google",
          "engines": { "google": "https://google.com/search?q={}" }
        },
        "properties": {
          "complete": "bss"
        }
      }`,
    }});

    console = await page.showConsole();
    await console.inputKeys('open ');

    await eventually(async() => {
      let completions = await console.getCompletions();
      let titles = completions.filter(x => x.type === 'title').map(x => x.text);
      assert.deepEqual(titles, ['Bookmarks', 'Search Engines', 'Search Engines'])
    });
  })
});
