const selectPrevTab = (current) => {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    if (tabs.length < 2) {
      return;
    }
    let select = (current - 1) % tabs.length
    let id = tabs[select].id;
    chrome.tabs.update(id, { active: true })
  });
};

const selectNextTab = (current) => {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    if (tabs.length < 2) {
      return;
    }
    let select = (current + 1 + tabs.length) % tabs.length
    let id = tabs[select].id;
    chrome.tabs.update(id, { active: true })
  });
};

export { selectNextTab, selectPrevTab };
