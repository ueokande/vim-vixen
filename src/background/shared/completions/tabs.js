const getCompletions = (keyword) => {
  return browser.tabs.query({ currentWindow: true }).then((tabs) => {
    let matched = tabs.filter((t) => {
      return t.url.includes(keyword) || t.title && t.title.includes(keyword);
    });
    return matched;
  });
};

export { getCompletions };
