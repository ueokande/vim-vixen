const focusInput = () => {
  let inputTypes = ['email', 'number', 'search', 'tel', 'text', 'url'];
  let inputSelector = inputTypes.map(type => `input[type=${type}]`).join(',');
  let target = window.document.querySelector(inputSelector + ',textarea');
  if (target) {
    target.focus();
  }
};

export { focusInput };
