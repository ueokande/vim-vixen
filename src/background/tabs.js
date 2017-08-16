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

export { closeTab, reopenTab, selectNextTab, selectPrevTab };
