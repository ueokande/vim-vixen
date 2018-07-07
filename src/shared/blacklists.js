import * as re from 'shared/utils/re';

const includes = (blacklist, url) => {
  let u = new URL(url)
  return blacklist.some((item) => {
    if (!item.includes('/')) {
      return re.fromWildcard(item).test(u.hostname);
    }
    return re.fromWildcard(item).test(u.hostname + u.pathname);
  });
}

export { includes };
