const modifierdKeyName = (name) => {
  if (name.length === 1) {
    return name;
  } else if (name === 'Escape') {
    return 'Esc';
  }
  return name;
};

const fromKeyboardEvent = (e) => {
  let key = modifierdKeyName(e.key);
  let shift = e.shiftKey;
  if (key.length === 1 && key.toUpperCase() === key.toLowerCase()) {
    // make shift false for symbols to enable key bindings by symbold keys.
    // But this limits key bindings by symbol keys with Shift (such as Shift+$>.
    shift = false;
  }

  return {
    key: modifierdKeyName(e.key),
    repeat: e.repeat,
    shiftKey: shift,
    ctrlKey: e.ctrlKey,
    altKey: e.altKey,
    metaKey: e.metaKey,
  };
};

const fromMapKey = (key) => {
  if (key.startsWith('<') && key.endsWith('>')) {
    let inner = key.slice(1, -1);
    let shift = inner.includes('S-');
    let base = inner.slice(inner.lastIndexOf('-') + 1);
    if (shift && base.length === 1) {
      base = base.toUpperCase();
    } else if (!shift && base.length === 1) {
      base = base.toLowerCase();
    }
    return {
      key: base,
      shiftKey: inner.includes('S-'),
      ctrlKey: inner.includes('C-'),
      altKey: inner.includes('A-'),
      metaKey: inner.includes('M-'),
    };
  }
  return {
    key: key,
    shiftKey: key.toLowerCase() !== key,
    ctrlKey: false,
    altKey: false,
    metaKey: false,
  };
};

const fromMapKeys = (keys) => {
  const fromMapKeysRecursive = (remainings, mappedKeys) => {
    if (remainings.length === 0) {
      return mappedKeys;
    }

    let nextPos = 1;
    if (remainings.startsWith('<')) {
      let ltPos = remainings.indexOf('>');
      if (ltPos > 0) {
        nextPos = ltPos + 1;
      }
    }

    return fromMapKeysRecursive(
      remainings.slice(nextPos),
      mappedKeys.concat([fromMapKey(remainings.slice(0, nextPos))])
    );
  };

  return fromMapKeysRecursive(keys, []);
};

const equals = (e1, e2) => {
  return e1.key === e2.key &&
    e1.ctrlKey === e2.ctrlKey &&
    e1.metaKey === e2.metaKey &&
    e1.altKey === e2.altKey &&
    e1.shiftKey === e2.shiftKey;
};

export { fromKeyboardEvent, fromMapKey, fromMapKeys, equals };
