const yank = (win) => {
  let input = win.document.createElement('input');
  win.document.body.append(input);

  input.style.position = 'fixed';
  input.style.top = '-100px';
  input.value = win.location.href;
  input.select();

  win.document.execCommand('copy');

  input.remove();
};

export { yank };
