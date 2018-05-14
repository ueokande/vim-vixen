const create = (props = {}) => {
  return new Promise((resolve) => {
    browser.tabs.create(props).then((createdTab) => {
      let callback = (tabId, changeInfo, tab) => {
        if (tab.url !== 'about:blank' && tabId === createdTab.id &&
            changeInfo.status === 'complete') {
          browser.tabs.onUpdated.removeListener(callback);

          // wait for 50 milliseconds to ensure plugin loaded;
          setTimeout(() => resolve(tab), 50);
        }
      };
      browser.tabs.onUpdated.addListener(callback);
    });
  });
};

const selectAt = (props = {}) => {
  return browser.tabs.query({ windowId: props.windowId }).then((tabs) => {
    let target = tabs[props.index];
    return browser.tabs.update(target.id, { active: true });
  });
};


export {
  create, selectAt
};
