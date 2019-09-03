const lanthan = require('lanthan');
const path = require('path');
const assert = require('assert');

describe("options form page", () => {
  let firefox;
  let session;
  let browser;

  beforeEach(async() => {
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

    let tabs = await browser.tabs.query({});
    for (let tab of tabs.slice(1)) {
      await browser.tabs.remove(tab.id);
    }
  })

  afterEach(async() => {
    if (firefox) {
      await firefox.close();
    }
  })

  const setBlacklistValue = async(nth, value) => {
    let selector = '.form-blacklist-form .column-url';
    let input = (await session.findElementsByCSS(selector))[nth];
    await input.sendKeys(value);
    await session.executeScript(`document.querySelectorAll('${selector}')[${nth}].blur()`);
  }

  const setSearchEngineValue = async(nth, name, url) => {
    let selector = '.form-search-form input.column-name';
    let input = (await session.findElementsByCSS(selector))[nth];
    await input.sendKeys(name);
    await session.executeScript(`document.querySelectorAll('${selector}')[${nth}].blur()`);

    selector = '.form-search-form input.column-url';
    input = (await session.findElementsByCSS(selector))[nth];
    await input.sendKeys(url);
    await session.executeScript(`document.querySelectorAll('${selector}')[${nth}].blur()`);
  }

  it('switch to form settings', async () => {
    let url = await browser.runtime.getURL("build/settings.html")
    await session.navigateTo(url);

    let useFormInput = await session.findElementByCSS('#setting-source-form');
    await useFormInput.click();
    await session.acceptAlert();

    let { settings } = await browser.storage.local.get('settings');
    assert.equal(settings.source, 'form')
  })

  it('add blacklist', async () => {
    let url = await browser.runtime.getURL("build/settings.html")
    await session.navigateTo(url);

    let useFormInput = await session.findElementByCSS('#setting-source-form');
    await useFormInput.click();
    await session.acceptAlert();
    await session.executeScript(() => window.scrollBy(0, 1000));

    // assert default
    let settings = (await browser.storage.local.get('settings')).settings;
    assert.deepEqual(settings.form.blacklist, [])

    // add blacklist items
    let addButton = await session.findElementByCSS('.form-blacklist-form .ui-add-button');
    await addButton.click();
    await setBlacklistValue(0, 'google.com')

    settings = (await browser.storage.local.get('settings')).settings;
    assert.deepEqual(settings.form.blacklist, ['google.com'])

    await addButton.click();
    await setBlacklistValue(1, 'yahoo.com')

    settings = (await browser.storage.local.get('settings')).settings;
    assert.deepEqual(settings.form.blacklist, ['google.com', 'yahoo.com'])

    // delete first item
    let deleteButton = (await session.findElementsByCSS('.form-blacklist-form .ui-delete-button'))[0];
    await deleteButton.click()

    settings = (await browser.storage.local.get('settings')).settings;
    assert.deepEqual(settings.form.blacklist, ['yahoo.com'])
  });

  it('add search engines', async () => {
    let url = await browser.runtime.getURL("build/settings.html")
    await session.navigateTo(url);

    let useFormInput = await session.findElementByCSS('#setting-source-form');
    await useFormInput.click();
    await session.acceptAlert();

    // assert default
    let settings = (await browser.storage.local.get('settings')).settings;
    assert.deepEqual(settings.form.search.default, 'google');

    // change default
    let radio = (await session.findElementsByCSS('.form-search-form input[type=radio]'))[2];
    await radio.click();
    settings = (await browser.storage.local.get('settings')).settings;
    assert.deepEqual(settings.form.search.default, 'bing');

    let addButton = await session.findElementByCSS('.form-search-form .ui-add-button');
    await addButton.click();
    await setSearchEngineValue(6, 'yippy', 'https://www.yippy.com/search?query={}');

    settings = (await browser.storage.local.get('settings')).settings;
    assert.deepEqual(settings.form.search.engines[6], ['yippy', 'https://www.yippy.com/search?query={}']);
  });
});
