const identifyKey = (key1, key2) => {
  return (key1.code === key2.code) &&
    ((key1.shift || false) === (key2.shift || false)) &&
    ((key1.ctrl || false) === (key2.ctrl || false)) &&
    ((key1.alt || false) === (key2.alt || false)) &&
    ((key1.meta || false) === (key2.meta || false));
};

const hasPrefix = (keys, prefix) => {
  if (keys.length < prefix.length) {
    return false;
  }
  for (let i = 0; i < keys.length; ++i) {
    if (!identifyKey(keys[i], prefix[i])) {
      return false;
    }
  }
  return true;
}

const identifyKeys = (keys1, keys2) => {
  if (keys1.length !== keys2.length) {
    return false;
  }
  return hasPrefix(keys1, keys2);
}

export { identifyKey, identifyKeys, hasPrefix };
