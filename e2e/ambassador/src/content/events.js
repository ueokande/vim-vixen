const keypress = (opts) => {
  let event = new KeyboardEvent('keypress', {
    key: opts.key,
    altKey: opts.altKey,
    shiftKey: opts.shiftKey,
    ctrlKey: opts.ctrlKey
  });
  document.body.dispatchEvent(event);
};

const keydown = (opts) => {
  let event = new KeyboardEvent('keydown', {
    key: opts.key,
    altKey: opts.altKey,
    shiftKey: opts.shiftKey,
    ctrlKey: opts.ctrlKey
  });
  document.body.dispatchEvent(event);
};

const keyup = (opts) => {
  let event = new KeyboardEvent('keyup', {
    key: opts.key,
    altKey: opts.altKey,
    shiftKey: opts.shiftKey,
    ctrlKey: opts.ctrlKey
  });
  document.body.dispatchEvent(event);
};

export { keypress, keydown, keyup };
