import * as doms from '../../shared/utils/dom';

export default interface FocusPresenter {
  focusFirstElement(): boolean;
}

export class FocusPresenterImpl implements FocusPresenter {
  focusFirstElement(): boolean {
    const inputTypes = ['email', 'number', 'search', 'tel', 'text', 'url'];
    const inputSelector = inputTypes.map(type => `input[type=${type}]`).join(',');
    const targets = window.document.querySelectorAll(inputSelector + ',textarea');
    const target = Array.from(targets).find(doms.isVisible);
    if (target instanceof HTMLInputElement) {
      target.focus();
      return true;
    } else if (target instanceof HTMLTextAreaElement) {
      target.focus();
      return true;
    }
    return false;
  }
}

