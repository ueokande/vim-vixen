import * as doms from 'shared/utils/dom';

const focusInput = () => {
  let inputTypes = ['email', 'number', 'search', 'tel', 'text', 'url'];
  let inputSelector = inputTypes.map(type => `input[type=${type}]`).join(',');
  let targets = window.document.querySelectorAll(inputSelector + ',textarea');
  let target = Array.from(targets).find(doms.isVisible);
  if (target) {
    target.focus();
  }
};

export { focusInput };
