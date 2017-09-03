const closeTab = (id) => {
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
    } else {
      return browser.sessions.restore(session.window.sessionId);
    }
  });
};

const selectAt = (index) => {
  return browser.tabs.query({ currentWindow: true }, (tabs) => {
    if (tabs.length < 2) {
      return;
    }
    if (index < 0 || tabs.length <= index) {
      throw new RangeError(`tab ${index} does not exist`)
    }
    let id = tabs[index].id;
    return browser.tabs.update(id, { active: true })
  });
};

const selectByKeyword = (keyword) => {
  return browser.tabs.query({ currentWindow: true }).then((tabs) => {
    let matched = tabs.filter((t) => {
      return t.url.includes(keyword) || t.title.includes(keyword)
    })

    if (matched.length == 0) {
      throw new RangeError('No matching buffer for ' + keyword);
    } else if (matched.length >= 2) {
      throw new RangeError('More than one match for ' + keyword);
    }

    return browser.tabs.update(matched[0].id, { active: true });
  });
}

const selectPrevTab = (current, count) => {
  return browser.tabs.query({ currentWindow: true }, (tabs) => {
    if (tabs.length < 2) {
      return;
    }
    let select = (current - count) % tabs.length
    let id = tabs[select].id;
    return browser.tabs.update(id, { active: true })
  });
};

const selectNextTab = (current, count) => {
  return browser.tabs.query({ currentWindow: true }, (tabs) => {
    if (tabs.length < 2) {
      return;
    }
    let select = (current + count + tabs.length) % tabs.length
    let id = tabs[select].id;
    return browser.tabs.update(id, { active: true })
  });
};

const reload = (current, cache) => {
  return browser.tabs.reload(
    current.id,
    { bypassCache: cache }
  );
};

export { closeTab, reopenTab, selectAt, selectByKeyword, selectNextTab, selectPrevTab, reload };
