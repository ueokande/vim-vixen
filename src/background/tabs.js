const closeTab = (id) => {
  browser.tabs.remove(id);
};

const reopenTab = () => {
  browser.sessions.getRecentlyClosed({
    maxResults: 1
  }).then((sessions) => {
    if (sessions.length === 0) {
      return;
    }
    let session = sessions[0];
    if (session.tab) {
      browser.sessions.restore(session.tab.sessionId);
    } else {
      browser.sessions.restore(session.window.sessionId);
    }
  });
};

const selectAt = (index) => {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    if (tabs.length < 2) {
      return;
    }
    if (index < 0 || tabs.length <= index) {
      throw new RangeError(`tab ${index} does not exist`)
    }
    let id = tabs[index].id;
    chrome.tabs.update(id, { active: true })
  });
};

const selectByKeyword = (keyword) => {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    let tab = tabs.find((tab) => tab.url.includes(keyword))
    if (tab) {
      chrome.tabs.update(tab.id, { active: true });
      return;
    }

    tab = tabs.find((tab) => tab.title.includes(keyword))
    if (tab) {
      chrome.tabs.update(tab.id, { active: true });
      return;
    }

    throw new RangeError('No matching buffer for ' + keyword);
  })
}

const selectPrevTab = (current, count) => {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    if (tabs.length < 2) {
      return;
    }
    let select = (current - count) % tabs.length
    let id = tabs[select].id;
    chrome.tabs.update(id, { active: true })
  });
};

const selectNextTab = (current, count) => {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    if (tabs.length < 2) {
      return;
    }
    let select = (current + count + tabs.length) % tabs.length
    let id = tabs[select].id;
    chrome.tabs.update(id, { active: true })
  });
};

const reload = (current, cache) => {
  browser.tabs.reload(
    current.id,
    { bypassCache: cache }
  );
};

export { closeTab, reopenTab, selectAt, selectByKeyword, selectNextTab, selectPrevTab, reload };
