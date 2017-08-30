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
    let matched = tabs.filter((t) => {
      return t.url.includes(keyword) || t.title.includes(keyword)
    })

    if (matched.length == 0) {
      throw new RangeError('No matching buffer for ' + keyword);
    } else if (matched.length >= 2) {
      throw new RangeError('More than one match for ' + keyword);
    }

    chrome.tabs.update(matched[0].id, { active: true });
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
