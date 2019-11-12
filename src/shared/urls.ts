import Search from './settings/Search';

const trimStart = (str: string): string => {
  // NOTE String.trimStart is available on Firefox 61
  return str.replace(/^\s+/, '');
};

const SUPPORTED_PROTOCOLS = ['http:', 'https:', 'ftp:', 'mailto:', 'about:'];

const isLocalhost = (url: string): boolean => {
  if (url === 'localhost') {
    return true;
  }

  let [host, port] = url.split(':', 2);
  return host === 'localhost' && !isNaN(Number(port));
};

const isMissingHttp = (keywords: string): boolean => {
  if (keywords.includes('.') && !keywords.includes(' ')) {
    return true;
  }

  try {
    let u = new URL('http://' + keywords);
    return isLocalhost(u.host);
  } catch (e) {
    // fallthrough
  }
  return false;
};

const searchUrl = (keywords: string, search: Search): string => {
  try {
    let u = new URL(keywords);
    if (SUPPORTED_PROTOCOLS.includes(u.protocol.toLowerCase())) {
      return u.href;
    }
  } catch (e) {
    // fallthrough
  }

  if (isMissingHttp(keywords)) {
    return 'http://' + keywords;
  }

  let template = search.engines[search.defaultEngine];
  let query = keywords;

  let first = trimStart(keywords).split(' ')[0];
  if (Object.keys(search.engines).includes(first)) {
    template = search.engines[first];
    query = trimStart(trimStart(keywords).slice(first.length));
  }
  return template.replace('{}', encodeURIComponent(query));
};

const normalizeUrl = (url: string): string => {
  try {
    let u = new URL(url);
    if (SUPPORTED_PROTOCOLS.includes(u.protocol.toLowerCase())) {
      return u.href;
    }
  } catch (e) {
    // fallthrough
  }
  return 'http://' + url;
};

export { searchUrl, normalizeUrl };
