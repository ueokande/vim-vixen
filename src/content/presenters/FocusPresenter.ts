import * as doms from '../../shared/utils/dom';

export default interface FocusPresenter {
  focusFirstElement(): boolean;

  // eslint-disable-next-line semi
}

export class FocusPresenterImpl implements FocusPresenter {
  focusFirstElement(): boolean {
    let inputTypes = ['email', 'number', 'search', 'tel', 'text', 'url'];
    let inputSelector = inputTypes.map(type => `input[type=${type}]`).join(',');
    let targets = window.document.querySelectorAll(inputSelector + ',textarea');
    let target = Array.from(targets).find(doms.isVisible);
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

