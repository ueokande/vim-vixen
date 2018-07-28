const trimStart = (str) => {
  // NOTE String.trimStart is available on Firefox 61
  return str.replace(/^\s+/, '');
};

const normalizeUrl = (keywords, searchSettings) => {
  try {
    return new URL(keywords).href;
  } catch (e) {
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
  }
};

export { normalizeUrl };
