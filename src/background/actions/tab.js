const openNewTab = (url) => {
  return browser.tabs.create({ url: url });
};

const openToTab = (url, tab) => {
  return browser.tabs.update(tab.id, { url: url });
};

const openBackground = (url) => {
  return browser.tabs.create({ url: url, active: false });
};

export { openToTab, openNewTab, openBackground };
