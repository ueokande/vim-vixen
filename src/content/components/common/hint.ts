import * as dom from '../../../shared/utils/dom';

interface Point {
  x: number;
  y: number;
}

const hintPosition = (element: Element): Point => {
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
  private target: HTMLElement;

  private element: HTMLElement;

  constructor(target: HTMLElement, tag: string) {
    let doc = target.ownerDocument;
    if (doc === null) {
      throw new TypeError('ownerDocument is null');
    }

    let { x, y } = hintPosition(target);
    let { scrollX, scrollY } = window;

    this.target = target;

    this.element = doc.createElement('span');
    this.element.className = 'vimvixen-hint';
    this.element.textContent = tag;
    this.element.style.left = x + scrollX + 'px';
    this.element.style.top = y + scrollY + 'px';

    this.show();
    doc.body.append(this.element);
  }

  show(): void {
    this.element.style.display = 'inline';
  }

  hide(): void {
    this.element.style.display = 'none';
  }

  remove(): void {
    this.element.remove();
  }

  getTarget(): HTMLElement {
    return this.target;
  }
}
