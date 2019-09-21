const path = require('path');
const assert = require('assert');
const { Builder } = require('lanthan');
const { By } = require('selenium-webdriver');

describe("options form page", () => {
  let lanthan;
  let webdriver;
  let browser;

  beforeEach(async() => {
    lanthan = await Builder
      .forBrowser('firefox')
      .spyAddon(path.join(__dirname, '..'))
      .build();
    webdriver = lanthan.getWebDriver();
    browser = lanthan.getWebExtBrowser();

    let tabs = await browser.tabs.query({});
    for (let tab of tabs.slice(1)) {
      await browser.tabs.remove(tab.id);
    }
  })

  afterEach(async() => {
    if (lanthan) {
      await lanthan.quit();
    }
  })

  const setBlacklistValue = async(nth, value) => {
    let selector = '.form-blacklist-form .column-url';
    let input = (await webdriver.findElements(By.css(selector)))[nth];
    await input.sendKeys(value);
    await webdriver.executeScript(`document.querySelectorAll('${selector}')[${nth}].blur()`);
  }

  const setSearchEngineValue = async(nth, name, url) => {
    let selector = '.form-search-form input.column-name';
    let input = (await webdriver.findElements(By.css(selector)))[nth];
    await input.sendKeys(name);
    await webdriver.executeScript(`document.querySelectorAll('${selector}')[${nth}].blur()`);

    selector = '.form-search-form input.column-url';
    input = (await webdriver.findElements(By.css(selector)))[nth];
    await input.sendKeys(url);
    await webdriver.executeScript(`document.querySelectorAll('${selector}')[${nth}].blur()`);
  }

  it('switch to form settings', async () => {
    let url = await browser.runtime.getURL("build/settings.html")
    await webdriver.navigate().to(url);

    let useFormInput = await webdriver.findElement(By.css('#setting-source-form'));
    await useFormInput.click();
    await webdriver.switchTo().alert().accept();

    let { settings } = await browser.storage.local.get('settings');
    assert.equal(settings.source, 'form')
  })

  it('add blacklist', async () => {
    let url = await browser.runtime.getURL("build/settings.html")
    await webdriver.navigate().to(url);

    let useFormInput = await webdriver.findElement(By.css('#setting-source-form'));
    await useFormInput.click();
    await webdriver.switchTo().alert().accept();
    await webdriver.executeScript(() => window.scrollBy(0, 1000));

    // assert default
    let settings = (await browser.storage.local.get('settings')).settings;
    assert.deepEqual(settings.form.blacklist, [])

    // add blacklist items
    let addButton = await webdriver.findElement(By.css('.form-blacklist-form .ui-add-button'))
    await addButton.click();
    await setBlacklistValue(0, 'google.com')

    settings = (await browser.storage.local.get('settings')).settings;
    assert.deepEqual(settings.form.blacklist, ['google.com'])

    await addButton.click();
    await setBlacklistValue(1, 'yahoo.com')

    settings = (await browser.storage.local.get('settings')).settings;
    assert.deepEqual(settings.form.blacklist, ['google.com', 'yahoo.com'])

    // delete first item
    let deleteButton = (await webdriver.findElements(By.css('.form-blacklist-form .ui-delete-button')))[0];
    await deleteButton.click()

    settings = (await browser.storage.local.get('settings')).settings;
    assert.deepEqual(settings.form.blacklist, ['yahoo.com'])
  });

  it('add search engines', async () => {
    let url = await browser.runtime.getURL("build/settings.html")
    await webdriver.navigate().to(url);

    let useFormInput = await webdriver.findElement(By.css('#setting-source-form'));
    await useFormInput.click();
    await webdriver.switchTo().alert().accept();

    // assert default
    let settings = (await browser.storage.local.get('settings')).settings;
    assert.deepEqual(settings.form.search.default, 'google');

    // change default
    let radio = (await webdriver.findElements(By.css('.form-search-form input[type=radio]')))[2];
    await radio.click();
    settings = (await browser.storage.local.get('settings')).settings;
    assert.deepEqual(settings.form.search.default, 'bing');

    let addButton = await webdriver.findElement(By.css('.form-search-form .ui-add-button'))
    await addButton.click();
    await setSearchEngineValue(6, 'yippy', 'https://www.yippy.com/search?query={}');

    settings = (await browser.storage.local.get('settings')).settings;
    assert.deepEqual(settings.form.search.engines[6], ['yippy', 'https://www.yippy.com/search?query={}']);
  });
});
