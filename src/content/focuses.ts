import * as doms from '../shared/utils/dom';

const focusInput = (): void => {
  let inputTypes = ['email', 'number', 'search', 'tel', 'text', 'url'];
  let inputSelector = inputTypes.map(type => `input[type=${type}]`).join(',');
  let targets = window.document.querySelectorAll(inputSelector + ',textarea');
  let target = Array.from(targets).find(doms.isVisible);
  if (target instanceof HTMLInputElement) {
    target.focus();
  } else if (target instanceof HTMLTextAreaElement) {
    target.focus();
  }
};

export { focusInput };
