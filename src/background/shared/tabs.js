import * as tabCompletions from './completions/tabs';

const closeTab = (id) => {
  return browser.tabs.get(id).then((tab) => {
    if (!tab.pinned) {
      return browser.tabs.remove(id);
    }
  });
};

const closeTabForce = (id) => {
  return browser.tabs.remove(id);
};

const queryByKeyword = (keyword, excludePinned = false) => {
  return browser.tabs.query({ currentWindow: true }).then((tabs) => {
    return tabs.filter((t) => {
      return t.url.toLowerCase().includes(keyword.toLowerCase()) ||
        t.title && t.title.toLowerCase().includes(keyword.toLowerCase());
    }).filter((t) => {
      return !(excludePinned && t.pinned);
    });
  });
};

const closeTabByKeywords = (keyword) => {
  return queryByKeyword(keyword, false).then((tabs) => {
    if (tabs.length === 0) {
      throw new Error('No matching buffer for ' + keyword);
    } else if (tabs.length > 1) {
      throw new Error('More than one match for ' + keyword);
    }
    browser.tabs.remove(tabs[0].id);
  });
};

const closeTabByKeywordsForce = (keyword) => {
  return queryByKeyword(keyword, true).then((tabs) => {
    if (tabs.length === 0) {
      throw new Error('No matching buffer for ' + keyword);
    } else if (tabs.length > 1) {
      throw new Error('More than one match for ' + keyword);
    }
    browser.tabs.remove(tabs[0].id);
  });
};

const closeTabsByKeywords = (keyword) => {
  tabCompletions.getCompletions(keyword).then((tabs) => {
    let tabs2 = tabs.filter(tab => !tab.pinned);
    browser.tabs.remove(tabs2.map(tab => tab.id));
  });
};

const closeTabsByKeywordsForce = (keyword) => {
  tabCompletions.getCompletions(keyword).then((tabs) => {
    browser.tabs.remove(tabs.map(tab => tab.id));
  });
};

const reopenTab = () => {
  let window = null;
  return browser.windows.getCurrent().then().then((w) => {
    window = w;
    return browser.sessions.getRecentlyClosed();
  }).then((sessions) => {
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
  });
};

const selectAt = (index) => {
  return browser.tabs.query({ currentWindow: true }).then((tabs) => {
    if (tabs.length < 2) {
      return;
    }
    if (index < 0 || tabs.length <= index) {
      throw new RangeError(`tab ${index + 1} does not exist`);
    }
    let id = tabs[index].id;
    return browser.tabs.update(id, { active: true });
  });
};

const selectByKeyword = (current, keyword) => {
  return queryByKeyword(keyword).then((tabs) => {
    if (tabs.length === 0) {
      throw new RangeError('No matching buffer for ' + keyword);
    }
    for (let tab of tabs) {
      if (tab.index > current.index) {
        return browser.tabs.update(tab.id, { active: true });
      }
    }
    return browser.tabs.update(tabs[0].id, { active: true });
  });
};

const selectPrevTab = (current, count) => {
  return browser.tabs.query({ currentWindow: true }).then((tabs) => {
    if (tabs.length < 2) {
      return;
    }
    let select = (current - count + tabs.length) % tabs.length;
    let id = tabs[select].id;
    return browser.tabs.update(id, { active: true });
  });
};

const selectNextTab = (current, count) => {
  return browser.tabs.query({ currentWindow: true }).then((tabs) => {
    if (tabs.length < 2) {
      return;
    }
    let select = (current + count) % tabs.length;
    let id = tabs[select].id;
    return browser.tabs.update(id, { active: true });
  });
};

const selectFirstTab = () => {
  return browser.tabs.query({ currentWindow: true }).then((tabs) => {
    let id = tabs[0].id;
    return browser.tabs.update(id, { active: true });
  });
};

const selectLastTab = () => {
  return browser.tabs.query({ currentWindow: true }).then((tabs) => {
    let id = tabs[tabs.length - 1].id;
    return browser.tabs.update(id, { active: true });
  });
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
  return browser.tabs.query({ currentWindow: true, active: true })
    .then(() => {
      return browser.tabs.update(current.id, { pinned: pinned });
    });
};

const toggleTabPinned = (current) => {
  updateTabPinned(current, !current.pinned);
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
