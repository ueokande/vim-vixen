type Item = browser.history.HistoryItem;

const filterHttp = (items: Item[]): Item[] => {
  const httpsHosts = items.map(x => new URL(x.url as string))
    .filter(x => x.protocol === 'https:')
    .map(x => x.host);
  const hostsSet = new Set(httpsHosts);

  return items.filter((item: Item) => {
    const url = new URL(item.url as string);
    return url.protocol === 'https:' || !hostsSet.has(url.host);
  });
};

const filterBlankTitle = (items: Item[]): Item[] => {
  return items.filter(item => item.title && item.title !== '');
};

const filterByTailingSlash = (items: Item[]): Item[] => {
  const urls = items.map(item => new URL(item.url as string));
  const simplePaths = urls
    .filter(url => url.hash === '' && url.search === '')
    .map(url => url.origin + url.pathname);
  const pathsSet = new Set(simplePaths);

  return items.filter((item) => {
    const url = new URL(item.url as string);
    if (url.hash !== '' || url.search !== '' ||
      url.pathname.slice(-1) !== '/') {
      return true;
    }
    return !pathsSet.has(url.origin + url.pathname.slice(0, -1));
  });
};

const filterByPathname = (items: Item[], min: number): Item[] => {
  const hash: {[key: string]: Item} = {};
  for (const item of items) {
    const url = new URL(item.url as string);
    const pathname = url.origin + url.pathname;
    if (!hash[pathname]) {
      hash[pathname] = item;
    } else if ((hash[pathname].url as string).length >
      (item.url as string).length) {
      hash[pathname] = item;
    }
  }
  const filtered = Object.values(hash);
  if (filtered.length < min) {
    return items;
  }
  return filtered;
};

const filterByOrigin = (items: Item[], min: number): Item[] => {
  const hash: {[key: string]: Item} = {};
  for (const item of items) {
    const origin = new URL(item.url as string).origin;
    if (!hash[origin]) {
      hash[origin] = item;
    } else if ((hash[origin].url as string).length >
      (item.url as string).length) {
      hash[origin] = item;
    }
  }
  const filtered = Object.values(hash);
  if (filtered.length < min) {
    return items;
  }
  return filtered;
};

export {
  filterHttp, filterBlankTitle, filterByTailingSlash,
  filterByPathname, filterByOrigin
};
