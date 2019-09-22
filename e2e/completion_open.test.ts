import express from 'express';
import * as path from 'path';
import * as assert from 'assert';
import * as http from 'http';

import settings from './settings';
import eventually from './eventually';
import { Builder, Lanthan } from 'lanthan';
import { WebDriver, WebElement, By, Key } from 'selenium-webdriver';
import { Console } from './lib/Console';

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
  let body: WebElement;

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
    await webdriver.navigate().to(`http://127.0.0.1:${port}`);
    body = await webdriver.findElement(By.css('body'));
  });

  it('should show completions from search engines, bookmarks, and histories by "open" command', async() => {
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let c = new Console(webdriver);
    await c.sendKeys('open ');

    await eventually(async() => {
      let completions = await c.getCompletions();
      assert.ok(completions.find(x => x.type === 'title' && x.text === 'Search Engines'));
      assert.ok(completions.find(x => x.type === 'title' && x.text === 'Bookmarks'));
      assert.ok(completions.find(x => x.type === 'title' && x.text === 'History'));
    });
  });

  it('should filter items with URLs by keywords on "open" command', async() => {
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let c = new Console(webdriver);
    await c.sendKeys('open https://');

    await eventually(async() => {
      let completions = await c.getCompletions();
      let items = completions.filter(x => x.type === 'item').map(x => x.text);
      assert.ok(items.every(x => x.includes('https://')));
    });
  })

  it('should filter items with titles by keywords on "open" command', async() => {
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let c = new Console(webdriver);
    await c.sendKeys('open getting');

    await eventually(async() => {
      let completions = await c.getCompletions();
      let items = completions.filter(x => x.type === 'item').map(x => x.text);
      assert.ok(items.every(x => x.toLowerCase().includes('getting')));
    });
  })

  it('should filter items with titles by keywords on "tabopen" command', async() => {
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let c = new Console(webdriver);
    await c.sendKeys('tabopen https://');

    await eventually(async() => {
      let completions = await c.getCompletions();
      let items = completions.filter(x => x.type === 'item').map(x => x.text);
      assert.ok(items.every(x => x.includes('https://')));
    });
  })

  it('should filter items with titles by keywords on "winopen" command', async() => {
    await body.sendKeys(':');

    await webdriver.switchTo().frame(0);
    let c = new Console(webdriver);
    await c.sendKeys('winopen https://');

    await eventually(async() => {
      let completions = await c.getCompletions();
      let items = completions.filter(x => x.type === 'item').map(x => x.text);
      assert.ok(items.every(x => x.includes('https://')));
    });
  })

  it('should display only specified items in "complete" property by set command', async() => {
    let c = new Console(webdriver);

    const execCommand = async(line: string) => {
      await body.sendKeys(':');
      await webdriver.switchTo().frame(0);
      await c.sendKeys(line, Key.ENTER);
      await new Promise(resolve => setTimeout(resolve, 100));
      await (webdriver.switchTo() as any).parentFrame();
    }

    const typeCommand = async(...keys: string[]) => {
      await body.sendKeys(':');
      await webdriver.switchTo().frame(0);
      await c.sendKeys(...keys);
    }

    const cancel = async() => {
      await c.sendKeys(Key.ESCAPE);
      await new Promise(resolve => setTimeout(resolve, 100));
      await (webdriver.switchTo() as any).parentFrame();
    }

    await execCommand('set complete=sbh');
    await typeCommand('open ');

    await eventually(async() => {
      let completions = await c.getCompletions();
      let titles = completions.filter(x => x.type === 'title').map(x => x.text);
      assert.deepEqual(titles, ['Search Engines', 'Bookmarks', 'History'])
    });

    await cancel();
    await execCommand('set complete=bss');
    await typeCommand('open ');

    await eventually(async() => {
      let completions = await c.getCompletions();
      let titles = completions.filter(x => x.type === 'title').map(x => x.text);
      assert.deepEqual(titles, ['Bookmarks', 'Search Engines', 'Search Engines'])
    });
  })

  it('should display only specified items in "complete" property by setting', async() => {
    const settings = {
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
    };
    await browser.storage.local.set({ settings, });

    let c = new Console(webdriver);

    const typeCommand = async(...keys: string[]) => {
      await body.sendKeys(':');
      await webdriver.switchTo().frame(0);
      await c.sendKeys(...keys);
    }

    const cancel = async() => {
      await c.sendKeys(Key.ESCAPE);
      await new Promise(resolve => setTimeout(resolve, 100));
      await (webdriver.switchTo() as any).parentFrame();
    }

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
    await typeCommand('open ');

    await eventually(async() => {
      let completions = await c.getCompletions();
      let titles = completions.filter(x => x.type === 'title').map(x => x.text);
      assert.deepEqual(titles, ['Search Engines', 'Bookmarks', 'History'])
    });

    await cancel();

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
    await typeCommand('open ');

    await eventually(async() => {
      let completions = await c.getCompletions();
      let titles = completions.filter(x => x.type === 'title').map(x => x.text);
      assert.deepEqual(titles, ['Bookmarks', 'Search Engines', 'Search Engines'])
    });


  })
});
