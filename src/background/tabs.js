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

export { selectNextTab, selectPrevTab };
