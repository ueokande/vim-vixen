const express = require('express');
const { Builder } = require('lanthan');
const path = require('path');
const assert = require('assert');
const eventually = require('./eventually');
const { Key, By } = require('selenium-webdriver');

describe("zoom test", () => {
  let lanthan;
  let webdriver;
  let browser;
  let tab;
  let body;

  before(async() => {
    lanthan = await Builder
      .forBrowser('firefox')
      .spyAddon(path.join(__dirname, '..'))
      .build();
    webdriver = lanthan.getWebDriver();
    browser = lanthan.getWebExtBrowser();
    tab = (await browser.tabs.query({}))[0]
  });

  after(async() => {
    await lanthan.quit();
  });

  beforeEach(async() => {
    await webdriver.navigate().to('about:blank');
    body = await webdriver.findElement(By.css('body'));
  });

  it('should zoom in by zi', async () => {
    let before = await browser.tabs.getZoom(tab.id);
    await body.sendKeys('z', 'i');

    await eventually(async() => {
      let actual = await browser.tabs.getZoom(tab.id);
      assert(before < actual);
    });
  });

  it('should zoom out by zo', async () => {
    let before = await browser.tabs.getZoom(tab.id);
    await body.sendKeys('z', 'o');

    await eventually(async() => {
      let actual = await browser.tabs.getZoom(tab.id);
      assert(before > actual);
    });
  });

  it('scrolls left by h', async () => {
    await browser.tabs.setZoom(tab.id, 2);
    await body.sendKeys('z', 'z');

    await eventually(async() => {
      let actual = await browser.tabs.getZoom(tab.id);
      assert(actual === 1);
    });
  });
});

