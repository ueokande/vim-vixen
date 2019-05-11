const trimStart = (str: string): string => {
  // NOTE String.trimStart is available on Firefox 61
  return str.replace(/^\s+/, '');
};

const SUPPORTED_PROTOCOLS = ['http:', 'https:', 'ftp:', 'mailto:', 'about:'];

const searchUrl = (keywords: string, searchSettings: any): string => {
  try {
    let u = new URL(keywords);
    if (SUPPORTED_PROTOCOLS.includes(u.protocol.toLowerCase())) {
      return u.href;
    }
  } catch (e) {
    // fallthrough
  }
  if (keywords.includes('.') && !keywords.includes(' ')) {
    return 'http://' + keywords;
  }
  let template = searchSettings.engines[searchSettings.default];
  let query = keywords;

  let first = trimStart(keywords).split(' ')[0];
  if (Object.keys(searchSettings.engines).includes(first)) {
    template = searchSettings.engines[first];
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
