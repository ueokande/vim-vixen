import * as re from './utils/re';

const includes = (blacklist: string[], url: string): boolean => {
  let u = new URL(url);
  return blacklist.some((item) => {
    if (!item.includes('/')) {
      return re.fromWildcard(item).test(u.host);
    }
    return re.fromWildcard(item).test(u.host + u.pathname);
  });
};

export { includes };
