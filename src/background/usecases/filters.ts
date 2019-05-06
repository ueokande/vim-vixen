type Item = browser.history.HistoryItem;

const filterHttp = (items: Item[]): Item[] => {
  let httpsHosts = items.map(x => new URL(x.url as string))
    .filter(x => x.protocol === 'https:')
    .map(x => x.host);
  let hostsSet = new Set(httpsHosts);

  return items.filter((item: Item) => {
    let url = new URL(item.url as string);
    return url.protocol === 'https:' || !hostsSet.has(url.host);
  });
};

const filterBlankTitle = (items: Item[]): Item[] => {
  return items.filter(item => item.title && item.title !== '');
};

const filterByTailingSlash = (items: Item[]): Item[] => {
  let urls = items.map(item => new URL(item.url as string));
  let simplePaths = urls
    .filter(url => url.hash === '' && url.search === '')
    .map(url => url.origin + url.pathname);
  let pathsSet = new Set(simplePaths);

  return items.filter((item) => {
    let url = new URL(item.url as string);
    if (url.hash !== '' || url.search !== '' ||
      url.pathname.slice(-1) !== '/') {
      return true;
    }
    return !pathsSet.has(url.origin + url.pathname.slice(0, -1));
  });
};

const filterByPathname = (items: Item[], min: number): Item[] => {
  let hash: {[key: string]: Item} = {};
  for (let item of items) {
    let url = new URL(item.url as string);
    let pathname = url.origin + url.pathname;
    if (!hash[pathname]) {
      hash[pathname] = item;
    } else if ((hash[pathname].url as string).length >
      (item.url as string).length) {
      hash[pathname] = item;
    }
  }
  let filtered = Object.values(hash);
  if (filtered.length < min) {
    return items;
  }
  return filtered;
};

const filterByOrigin = (items: Item[], min: number): Item[] => {
  let hash: {[key: string]: Item} = {};
  for (let item of items) {
    let origin = new URL(item.url as string).origin;
    if (!hash[origin]) {
      hash[origin] = item;
    } else if ((hash[origin].url as string).length >
      (item.url as string).length) {
      hash[origin] = item;
    }
  }
  let filtered = Object.values(hash);
  if (filtered.length < min) {
    return items;
  }
  return filtered;
};

export {
  filterHttp, filterBlankTitle, filterByTailingSlash,
  filterByPathname, filterByOrigin
};
