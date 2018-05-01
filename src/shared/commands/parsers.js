const normalizeUrl = (args, searchConfig) => {
  let concat = args.join(' ');
  try {
    return new URL(concat).href;
  } catch (e) {
    if (concat.includes('.') && !concat.includes(' ')) {
      return 'http://' + concat;
    }
    let query = concat;
    let template = searchConfig.engines[
      searchConfig.default
    ];
    for (let key in searchConfig.engines) {
      if (args[0] === key) {
        query = args.slice(1).join(' ');
        template = searchConfig.engines[key];
      }
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

const parseCommandLine = (line) => {
  let words = line.trim().split(/ +/);
  let name = words.shift();
  return [name, words];
};

export { normalizeUrl, parseCommandLine, parseSetOption };
