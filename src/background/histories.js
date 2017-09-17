const getCompletions = (keyword) => {
  return browser.history.search({
    text: keyword,
    startTime: '1970-01-01'
  }).then((items) => {
    return items.sort((x, y) => x.lastVisitTime < y.lastVisitTime).slice(0, 10);
  });
};

export { getCompletions };
