let prevSelTab = 1;
let currSelTab = 1;

browser.tabs.onActivated.addListener((activeInfo) => {
  return browser.tabs.query({ currentWindow: true }).then(() => {
    prevSelTab = currSelTab;
    currSelTab = activeInfo.tabId;
  });
});

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

const reopenTab = () => {
  return browser.sessions.getRecentlyClosed({
    maxResults: 1
  }).then((sessions) => {
    if (sessions.length === 0) {
      return;
    }
    let session = sessions[0];
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
  return browser.tabs.query({ currentWindow: true }).then((tabs) => {
    let matched = tabs.filter((t) => {
      return t.url.includes(keyword) || t.title.includes(keyword);
    });

    if (matched.length === 0) {
      throw new RangeError('No matching buffer for ' + keyword);
    }
    for (let tab of matched) {
      if (tab.index > current.index) {
        return browser.tabs.update(tab.id, { active: true });
      }
    }
    return browser.tabs.update(matched[0].id, { active: true });
  });
};

const getCompletions = (keyword) => {
  return browser.tabs.query({ currentWindow: true }).then((tabs) => {
    let matched = tabs.filter((t) => {
      return t.url.includes(keyword) || t.title && t.title.includes(keyword);
    });
    return matched;
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

const selectPrevSelTab = () => {
  return browser.tabs.update(prevSelTab, { active: true });
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
  closeTab, closeTabForce, reopenTab, selectAt, selectByKeyword,
  getCompletions, selectPrevTab, selectNextTab, selectFirstTab,
  selectLastTab, selectPrevSelTab, reload, updateTabPinned,
  toggleTabPinned, duplicate
};
