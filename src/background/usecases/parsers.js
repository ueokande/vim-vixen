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

const mustNumber = (v) => {
  let num = Number(v);
  if (isNaN(num)) {
    throw new Error('Not number: ' + v);
  }
  return num;
};

const parseSetOption = (word, types) => {
  let [key, value] = word.split('=');
  if (value === undefined) {
    value = !key.startsWith('no');
    key = value ? key : key.slice(2);
  }
  let type = types[key];
  if (!type) {
    throw new Error('Unknown property: ' + key);
  }
  if (type === 'boolean' && typeof value !== 'boolean' ||
       type !== 'boolean' && typeof value === 'boolean') {
    throw new Error('Invalid argument: ' + word);
  }

  switch (type) {
  case 'string': return [key, value];
  case 'number': return [key, mustNumber(value)];
  case 'boolean': return [key, value];
  }
};

export { normalizeUrl, parseSetOption };
