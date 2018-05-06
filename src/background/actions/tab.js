import actions from './index';

const openNewTab = (url, openerTabId, background = false, adjacent = false) => {
  if (adjacent) {
    return browser.tabs.query({
      active: true, currentWindow: true
    }).then((tabs) => {
      return browser.tabs.create({
        url,
        openerTabId,
        active: !background,
        index: tabs[0].index + 1
      });
    });
  }
  return browser.tabs.create({ url, active: !background });
};

const openToTab = (url, tab) => {
  return browser.tabs.update(tab.id, { url: url });
};

const selected = (tabId) => {
  return {
    type: actions.TAB_SELECTED,
    tabId,
  };
};

export { openNewTab, openToTab, selected };
