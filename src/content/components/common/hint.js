import './hint.css';
import * as dom from 'shared/utils/dom';

const hintPosition = (element) => {
  let { left, top, right, bottom } = dom.viewportRect(element);

  if (element.tagName !== 'AREA') {
    return { x: left, y: top };
  }

  return {
    x: (left + right) / 2,
    y: (top + bottom) / 2,
  };
};

export default class Hint {
  constructor(target, tag) {
    if (!(document.body instanceof HTMLElement)) {
      throw new TypeError('target is not an HTMLElement');
    }

    this.target = target;

    let doc = target.ownerDocument;
    let { x, y } = hintPosition(target);
    let { scrollX, scrollY } = window;

    this.element = doc.createElement('span');
    this.element.className = 'vimvixen-hint';
    this.element.textContent = tag;
    this.element.style.left = x + scrollX + 'px';
    this.element.style.top = y + scrollY + 'px';

    this.show();
    doc.body.append(this.element);
  }

  show() {
    this.element.style.display = 'inline';
  }

  hide() {
    this.element.style.display = 'none';
  }

  remove() {
    this.element.remove();
  }
}
