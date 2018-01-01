const yank = (win, text) => {
  let input = win.document.createElement('input');
  win.document.body.append(input);

  input.style.position = 'fixed';
  input.style.top = '-100px';
  input.value = text;
  input.select();

  win.document.execCommand('copy');

  input.remove();
};

export { yank };
