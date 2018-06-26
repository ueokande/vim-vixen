import * as tabCompletions from './completions/tabs';

const closeTab = async(id) => {
  let tab = await browser.tabs.get(id);
  if (!tab.pinned) {
    return browser.tabs.remove(id);
  }
};

const closeTabForce = (id) => {
  return browser.tabs.remove(id);
};

const queryByKeyword = async(keyword, excludePinned = false) => {
  let tabs = await browser.tabs.query({ currentWindow: true });
  return tabs.filter((t) => {
    return t.url.toLowerCase().includes(keyword.toLowerCase()) ||
      t.title && t.title.toLowerCase().includes(keyword.toLowerCase());
  }).filter((t) => {
    return !(excludePinned && t.pinned);
  });
};

const closeTabByKeywords = async(keyword) => {
  let tabs = await queryByKeyword(keyword, true);
  if (tabs.length === 0) {
    throw new Error('No matching buffer for ' + keyword);
  } else if (tabs.length > 1) {
    throw new Error('More than one match for ' + keyword);
  }
  return browser.tabs.remove(tabs[0].id);
};

const closeTabByKeywordsForce = async(keyword) => {
  let tabs = await queryByKeyword(keyword, false);
  if (tabs.length === 0) {
    throw new Error('No matching buffer for ' + keyword);
  } else if (tabs.length > 1) {
    throw new Error('More than one match for ' + keyword);
  }
  return browser.tabs.remove(tabs[0].id);
};

const closeTabsByKeywords = async(keyword) => {
  let tabs = await tabCompletions.getCompletions(keyword);
  tabs = tabs.filter(tab => !tab.pinned);
  return browser.tabs.remove(tabs.map(tab => tab.id));
};

const closeTabsByKeywordsForce = async(keyword) => {
  let tabs = await tabCompletions.getCompletions(keyword);
  return browser.tabs.remove(tabs.map(tab => tab.id));
};

const reopenTab = async() => {
  let window = await browser.windows.getCurrent();
  let sessions = await browser.sessions.getRecentlyClosed();
  let session = sessions.find((s) => {
    return s.tab && s.tab.windowId === window.id;
  });
  if (!session) {
    return;
  }
  if (session.tab) {
    return browser.sessions.restore(session.tab.sessionId);
  }
  return browser.sessions.restore(session.window.sessionId);
};

const selectAt = async(index) => {
  let tabs = await browser.tabs.query({ currentWindow: true });
  if (tabs.length < 2) {
    return;
  }
  if (index < 0 || tabs.length <= index) {
    throw new RangeError(`tab ${index + 1} does not exist`);
  }
  let id = tabs[index].id;
  return browser.tabs.update(id, { active: true });
};

const selectByKeyword = async(current, keyword) => {
  let tabs = await queryByKeyword(keyword);
  if (tabs.length === 0) {
    throw new RangeError('No matching buffer for ' + keyword);
  }
  for (let tab of tabs) {
    if (tab.index > current.index) {
      return browser.tabs.update(tab.id, { active: true });
    }
  }
  return browser.tabs.update(tabs[0].id, { active: true });
};

const selectPrevTab = async(current, count) => {
  let tabs = await browser.tabs.query({ currentWindow: true });
  if (tabs.length < 2) {
    return;
  }
  let select = (current - count + tabs.length) % tabs.length;
  let id = tabs[select].id;
  return browser.tabs.update(id, { active: true });
};

const selectNextTab = async(current, count) => {
  let tabs = await browser.tabs.query({ currentWindow: true });
  if (tabs.length < 2) {
    return;
  }
  let select = (current + count) % tabs.length;
  let id = tabs[select].id;
  return browser.tabs.update(id, { active: true });
};

const selectFirstTab = async() => {
  let tabs = await browser.tabs.query({ currentWindow: true });
  let id = tabs[0].id;
  return browser.tabs.update(id, { active: true });
};

const selectLastTab = async() => {
  let tabs = await browser.tabs.query({ currentWindow: true });
  let id = tabs[tabs.length - 1].id;
  return browser.tabs.update(id, { active: true });
};

const selectTab = (id) => {
  return browser.tabs.update(id, { active: true });
};

const reload = (current, cache) => {
  return browser.tabs.reload(
    current.id,
    { bypassCache: cache }
  );
};

const updateTabPinned = (current, pinned) => {
  return browser.tabs.update(current.id, { pinned });
};

const toggleTabPinned = (current) => {
  return updateTabPinned(current, !current.pinned);
};

const duplicate = (id) => {
  return browser.tabs.duplicate(id);
};

export {
  closeTab, closeTabForce,
  queryByKeyword, closeTabByKeywords, closeTabByKeywordsForce,
  closeTabsByKeywords, closeTabsByKeywordsForce,
  reopenTab, selectAt, selectByKeyword,
  selectPrevTab, selectNextTab, selectFirstTab,
  selectLastTab, selectTab, reload, updateTabPinned,
  toggleTabPinned, duplicate
};
