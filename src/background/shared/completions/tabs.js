const getCompletions = (keyword, excludePinned) => {
  return browser.tabs.query({ currentWindow: true }).then((tabs) => {
    let matched = tabs.filter((t) => {
      return t.url.includes(keyword) || t.title && t.title.includes(keyword);
    }).filter((t) => {
      return !(excludePinned && t.pinned);
    });
    return matched;
  });
};

export { getCompletions };
