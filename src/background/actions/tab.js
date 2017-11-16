const openToTab = (url, tab) => {
  return browser.tabs.update(tab.id, { url: url });
};

export { openToTab };
