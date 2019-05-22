import * as doms from '../../shared/utils/dom';

const SCROLL_DELTA_X = 64;
const SCROLL_DELTA_Y = 64;

// dirty way to store scrolling state on globally
let scrolling = false;
let lastTimeoutId: number | null = null;

const isScrollableStyle = (element: Element): boolean => {
  let { overflowX, overflowY } = window.getComputedStyle(element);
  return !(overflowX !== 'scroll' && overflowX !== 'auto' &&
    overflowY !== 'scroll' && overflowY !== 'auto');
};

const isOverflowed = (element: Element): boolean => {
  return element.scrollWidth > element.clientWidth ||
    element.scrollHeight > element.clientHeight;
};

// Find a visiable and scrollable element by depth-first search.  Currently
// this method is called by each scrolling, and the returned value of this
// method is not cached.  That does not cause performance issue because in the
// most pages, the window is root element i,e, documentElement.
const findScrollable = (element: Element): Element | null => {
  if (isScrollableStyle(element) && isOverflowed(element)) {
    return element;
  }

  let children = Array.from(element.children).filter(doms.isVisible);
  for (let child of children) {
    let scrollable = findScrollable(child);
    if (scrollable) {
      return scrollable;
    }
  }
  return null;
};

const scrollTarget = () => {
  if (isOverflowed(window.document.documentElement)) {
    return window.document.documentElement;
  }
  if (isOverflowed(window.document.body)) {
    return window.document.body;
  }
  let target = findScrollable(window.document.documentElement);
  if (target) {
    return target;
  }
  return window.document.documentElement;
};

const resetScrolling = () => {
  scrolling = false;
};

class Scroller {
  private element: Element;

  private smooth: boolean;

  constructor(element: Element, smooth: boolean) {
    this.element = element;
    this.smooth = smooth;
  }

  scrollTo(x: number, y: number): void {
    if (!this.smooth) {
      this.element.scrollTo(x, y);
      return;
    }
    this.element.scrollTo({
      left: x,
      top: y,
      behavior: 'smooth',
    });
    this.prepareReset();
  }

  scrollBy(x: number, y: number): void {
    let left = this.element.scrollLeft + x;
    let top = this.element.scrollTop + y;
    this.scrollTo(left, top);
  }

  prepareReset(): void {
    scrolling = true;
    if (lastTimeoutId) {
      clearTimeout(lastTimeoutId);
      lastTimeoutId = null;
    }
    lastTimeoutId = setTimeout(resetScrolling, 100);
  }
}

export type Point = { x: number, y: number };

export default interface ScrollPresenter {
  getScroll(): Point;
  scrollVertically(amount: number, smooth: boolean): void;
  scrollHorizonally(amount: number, smooth: boolean): void;
  scrollPages(amount: number, smooth: boolean): void;
  scrollTo(x: number, y: number, smooth: boolean): void;
  scrollToTop(smooth: boolean): void;
  scrollToBottom(smooth: boolean): void;
  scrollToHome(smooth: boolean): void;
  scrollToEnd(smooth: boolean): void;
}

export class ScrollPresenterImpl {
  getScroll(): Point {
    let target = scrollTarget();
    return { x: target.scrollLeft, y: target.scrollTop };
  }

  scrollVertically(count: number, smooth: boolean): void {
    let target = scrollTarget();
    let delta = SCROLL_DELTA_Y * count;
    if (scrolling) {
      delta = SCROLL_DELTA_Y * count * 4;
    }
    new Scroller(target, smooth).scrollBy(0, delta);
  }

  scrollHorizonally(count: number, smooth: boolean): void {
    let target = scrollTarget();
    let delta = SCROLL_DELTA_X * count;
    if (scrolling) {
      delta = SCROLL_DELTA_X * count * 4;
    }
    new Scroller(target, smooth).scrollBy(delta, 0);
  }

  scrollPages(count: number, smooth: boolean): void {
    let target = scrollTarget();
    let height = target.clientHeight;
    let delta = height * count;
    if (scrolling) {
      delta = height * count;
    }
    new Scroller(target, smooth).scrollBy(0, delta);
  }

  scrollTo(x: number, y: number, smooth: boolean): void {
    let target = scrollTarget();
    new Scroller(target, smooth).scrollTo(x, y);
  }

  scrollToTop(smooth: boolean): void {
    let target = scrollTarget();
    let x = target.scrollLeft;
    let y = 0;
    new Scroller(target, smooth).scrollTo(x, y);
  }

  scrollToBottom(smooth: boolean): void {
    let target = scrollTarget();
    let x = target.scrollLeft;
    let y = target.scrollHeight;
    new Scroller(target, smooth).scrollTo(x, y);
  }

  scrollToHome(smooth: boolean): void {
    let target = scrollTarget();
    let x = 0;
    let y = target.scrollTop;
    new Scroller(target, smooth).scrollTo(x, y);
  }

  scrollToEnd(smooth: boolean): void {
    let target = scrollTarget();
    let x = target.scrollWidth;
    let y = target.scrollTop;
    new Scroller(target, smooth).scrollTo(x, y);
  }
}
