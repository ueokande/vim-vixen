import Hint, { InputHint, LinkHint } from './Hint';
import * as doms from '../../shared/utils/dom';

const TARGET_SELECTOR = [
  'a', 'button', 'input', 'textarea', 'area',
  '[contenteditable=true]', '[contenteditable=""]', '[tabindex]',
  '[role="button"]', 'summary'
].join(',');

interface Size {
  width: number;
  height: number;
}

interface Point {
  x: number;
  y: number;
}

const inViewport = (
  win: Window,
  element: Element,
  viewSize: Size,
  framePosition: Point,
): boolean => {
  let {
    top, left, bottom, right
  } = doms.viewportRect(element);
  let doc = win.document;
  let frameWidth = doc.documentElement.clientWidth;
  let frameHeight = doc.documentElement.clientHeight;

  if (right < 0 || bottom < 0 || top > frameHeight || left > frameWidth) {
    // out of frame
    return false;
  }
  if (right + framePosition.x < 0 || bottom + framePosition.y < 0 ||
      left + framePosition.x > viewSize.width ||
      top + framePosition.y > viewSize.height) {
    // out of viewport
    return false;
  }
  return true;
};

const isAriaHiddenOrAriaDisabled = (win: Window, element: Element): boolean => {
  if (!element || win.document.documentElement === element) {
    return false;
  }
  for (let attr of ['aria-hidden', 'aria-disabled']) {
    let value = element.getAttribute(attr);
    if (value !== null) {
      let hidden = value.toLowerCase();
      if (hidden === '' || hidden === 'true') {
        return true;
      }
    }
  }
  return isAriaHiddenOrAriaDisabled(win, element.parentElement as Element);
};

export default interface FollowPresenter {
  getTargetCount(viewSize: Size, framePosition: Point): number;

  createHints(viewSize: Size, framePosition: Point, tags: string[]): void;

  filterHints(prefix: string): void;

  clearHints(): void;

  getHint(tag: string): Hint | undefined;
}

export class FollowPresenterImpl implements FollowPresenter {
  private hints: Hint[];

  constructor() {
    this.hints = [];
  }

  getTargetCount(viewSize: Size, framePosition: Point): number {
    let targets = this.getTargets(viewSize, framePosition);
    return targets.length;
  }

  createHints(viewSize: Size, framePosition: Point, tags: string[]): void {
    let targets = this.getTargets(viewSize, framePosition);
    let min = Math.min(targets.length, tags.length);
    for (let i = 0; i < min; ++i) {
      let target = targets[i];
      if (target instanceof HTMLAnchorElement ||
        target instanceof HTMLAreaElement) {
        this.hints.push(new LinkHint(target, tags[i]));
      } else {
        this.hints.push(new InputHint(target, tags[i]));
      }
    }
  }

  filterHints(prefix: string): void {
    let shown = this.hints.filter(h => h.getTag().startsWith(prefix));
    let hidden = this.hints.filter(h => !h.getTag().startsWith(prefix));

    shown.forEach(h => h.show());
    hidden.forEach(h => h.hide());
  }

  clearHints(): void {
    this.hints.forEach(h => h.remove());
    this.hints = [];
  }

  getHint(tag: string): Hint | undefined {
    return this.hints.find(h => h.getTag() === tag);
  }

  private getTargets(viewSize: Size, framePosition: Point): HTMLElement[] {
    let all = window.document.querySelectorAll(TARGET_SELECTOR);
    let filtered = Array.prototype.filter.call(all, (element: HTMLElement) => {
      let style = window.getComputedStyle(element);

      // AREA's 'display' in Browser style is 'none'
      return (element.tagName === 'AREA' || style.display !== 'none') &&
        style.visibility !== 'hidden' &&
        (element as HTMLInputElement).type !== 'hidden' &&
        element.offsetHeight > 0 &&
        !isAriaHiddenOrAriaDisabled(window, element) &&
        inViewport(window, element, viewSize, framePosition);
    });
    return filtered;
  }
}
