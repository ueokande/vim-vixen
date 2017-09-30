const asKeymapChars = (keys) => {
  return keys.map((k) => {
    let c = String.fromCharCode(k.code);
    if (k.ctrl) {
      return '<C-' + c.toUpperCase() + '>';
    }
    return c;
  }).join('');
};

const asCaretChars = (keys) => {
  return keys.map((k) => {
    let c = String.fromCharCode(k.code);
    if (k.ctrl) {
      return '^' + c.toUpperCase();
    }
    return c;
  }).join('');
};

export { asKeymapChars, asCaretChars };
