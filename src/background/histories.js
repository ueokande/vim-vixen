const filterHttp = (items) => {
  const httpsHosts = items
    .filter(item => item[1].protocol === 'https:')
    .map(item => item[1].host);
  const httpsHostSet = new Set(httpsHosts);
  return items.filter(
    item => !(item[1].protocol === 'http:' && httpsHostSet.has(item[1].host))
  );
};

const getCompletions = (keyword) => {
  return browser.history.search({
    text: keyword,
    startTime: '1970-01-01'
  }).then((items) => {
    return filterHttp(items.map(item => [item, new URL(item.url)]))
      .sort((x, y) => x[0].lastVisitTime < y[0].lastVisitTime)
      .slice(0, 10)
      .map(item => item[0]);
  });
};

export { getCompletions };
