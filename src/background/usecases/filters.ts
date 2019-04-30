const filterHttp = (items) => {
  let httpsHosts = items.map(x => new URL(x.url))
    .filter(x => x.protocol === 'https:')
    .map(x => x.host);
  httpsHosts = new Set(httpsHosts);

  return items.filter((item) => {
    let url = new URL(item.url);
    return url.protocol === 'https:' || !httpsHosts.has(url.host);
  });
};

const filterBlankTitle = (items) => {
  return items.filter(item => item.title && item.title !== '');
};

const filterByTailingSlash = (items) => {
  let urls = items.map(item => new URL(item.url));
  let simplePaths = urls
    .filter(url => url.hash === '' && url.search === '')
    .map(url => url.origin + url.pathname);
  simplePaths = new Set(simplePaths);

  return items.filter((item) => {
    let url = new URL(item.url);
    if (url.hash !== '' || url.search !== '' ||
      url.pathname.slice(-1) !== '/') {
      return true;
    }
    return !simplePaths.has(url.origin + url.pathname.slice(0, -1));
  });
};

const filterByPathname = (items, min) => {
  let hash = {};
  for (let item of items) {
    let url = new URL(item.url);
    let pathname = url.origin + url.pathname;
    if (!hash[pathname]) {
      hash[pathname] = item;
    } else if (hash[pathname].url.length > item.url.length) {
      hash[pathname] = item;
    }
  }
  let filtered = Object.values(hash);
  if (filtered.length < min) {
    return items;
  }
  return filtered;
};

const filterByOrigin = (items, min) => {
  let hash = {};
  for (let item of items) {
    let origin = new URL(item.url).origin;
    if (!hash[origin]) {
      hash[origin] = item;
    } else if (hash[origin].url.length > item.url.length) {
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
