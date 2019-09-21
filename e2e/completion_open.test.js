const express = require('express');
const lanthan = require('lanthan');
const path = require('path');
const assert = require('assert');
const eventually = require('./eventually');
const settings = require('./settings');
const { Builder } = require('lanthan');
const { By, Key } = require('selenium-webdriver');
const Console = require('./lib/Console');

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
  let lanthan;
  let webdriver;
  let browser;
  let body;

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
      assert(completions.find(x => x.type === 'title' && x.text === 'Search Engines'));
      assert(completions.find(x => x.type === 'title' && x.text === 'Bookmarks'));
      assert(completions.find(x => x.type === 'title' && x.text === 'History'));
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
      assert(items.every(x => x.includes('https://')));
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
      assert(items.every(x => x.toLowerCase().includes('getting')));
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
      assert(items.every(x => x.includes('https://')));
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
      assert(items.every(x => x.includes('https://')));
    });
  })

  it('should display only specified items in "complete" property by set command', async() => {
    let c = new Console(webdriver);

    const execCommand = async(line) => {
      await body.sendKeys(':');
      await webdriver.switchTo().frame(0);
      await c.sendKeys(line, Key.ENTER);
      await new Promise(resolve => setTimeout(resolve, 100));
      await webdriver.switchTo().parentFrame();
    }

    const typeCommand = async(...keys) => {
      await body.sendKeys(':');
      await webdriver.switchTo().frame(0);
      await c.sendKeys(...keys);
    }

    const cancel = async() => {
      await c.sendKeys(Key.ESCAPE);
      await new Promise(resolve => setTimeout(resolve, 100));
      await webdriver.switchTo().parentFrame();
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

    const typeCommand = async(...keys) => {
      await body.sendKeys(':');
      await webdriver.switchTo().frame(0);
      await c.sendKeys(...keys);
    }

    const cancel = async() => {
      await c.sendKeys(Key.ESCAPE);
      await new Promise(resolve => setTimeout(resolve, 100));
      await webdriver.switchTo().parentFrame();
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
