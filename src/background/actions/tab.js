import actions from './index';

const openNewTab = async(
  url, openerTabId, background = false, adjacent = false
) => {
  if (!adjacent) {
    await browser.tabs.create({ url, active: !background });
    return { type: '' };
  }
  let tabs = await browser.tabs.query({
    active: true, currentWindow: true
  });
  await browser.tabs.create({
    url,
    openerTabId,
    active: !background,
    index: tabs[0].index + 1
  });
  return { type: '' };
};

const openToTab = async(url, tab) => {
  await browser.tabs.update(tab.id, { url: url });
  return { type: '' };
};

const selected = (tabId) => {
  return {
    type: actions.TAB_SELECTED,
    tabId,
  };
};

export { openNewTab, openToTab, selected };
