const openNewTab = (url, openerTabId) => {
  return browser.tabs.create({ url, openerTabId });
};

const openToTab = (url, tab) => {
  return browser.tabs.update(tab.id, { url: url });
};

export { openToTab, openNewTab };
