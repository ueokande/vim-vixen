const keyEquals = (key1, key2) => {
  return (key1.code === key2.code) &&
    ((key1.shift || false) === (key2.shift || false)) &&
    ((key1.ctrl || false) === (key2.ctrl || false)) &&
    ((key1.alt || false) === (key2.alt || false)) &&
    ((key1.meta || false) === (key2.meta || false));
};

const keysEquals = (keys1, keys2) => {
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (let i = 0; i < keys1.length; ++i) {
    if (!keyEquals(keys1[i], keys2[i])) {
      return false;
    }
  }
  return true;
}

export { keyEquals, keysEquals };
