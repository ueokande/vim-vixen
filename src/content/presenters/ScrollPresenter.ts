import * as doms from "../../shared/utils/dom";

const SCROLL_DELTA_X = 64;
const SCROLL_DELTA_Y = 64;

// dirty way to store scrolling state on globally
let scrolling = false;
let lastTimeoutId: number | null = null;

const isScrollableStyle = (element: Element): boolean => {
  const { overflowX, overflowY, overflow } = window.getComputedStyle(element);
  return !(
    overflowX !== "scroll" &&
    overflowX !== "auto" &&
    overflowY !== "scroll" &&
    overflowY !== "auto" &&
    overflow !== "scroll" &&
    overflow !== "auto"
  );
};

enum Direction {
  Up,
  Down,
  Left,
  Right,
  NA,
}

const doneScrolling = (element: Element, direction: Direction): boolean => {
  switch (direction) {
    case Direction.Up:
      return element.scrollTop == 0;
    case Direction.Down:
      return element.scrollTop + element.clientHeight >= element.scrollHeight;
    case Direction.Left:
      return element.scrollLeft == 0;
    case Direction.Right:
      return element.scrollLeft + element.clientWidth >= element.scrollWidth;
    case Direction.NA:
      return (
        element.scrollTop + element.clientHeight >= element.scrollHeight &&
        element.scrollLeft + element.clientWidth >= element.scrollWidth
      );
  }
};

// Find a visiable and scrollable element by depth-first search.  Currently
// this method is called by each scrolling, and the returned value of this
// method is not cached.  That does not cause performance issue because in the
// most pages, the window is root element i,e, documentElement.
const findScrollable = (
  element: Element,
  direction: Direction
): Element | null => {
  if (isScrollableStyle(element) && !doneScrolling(element, direction)) {
    return element;
  }

  const children = Array.from(element.children).filter(doms.isVisible);
  for (const child of children) {
    const scrollable = findScrollable(child, direction);
    if (scrollable) {
      return scrollable;
    }
  }
  return null;
};

const scrollTarget = (direction: Direction) => {
  if (
    window.document.scrollingElement &&
    !doneScrolling(window.document.scrollingElement, direction)
  ) {
    return window.document.scrollingElement;
  }

  const target = findScrollable(window.document.documentElement, direction);
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
      behavior: "smooth",
    });
    this.prepareReset();
  }

  scrollBy(x: number, y: number): void {
    const left = this.element.scrollLeft + x;
    const top = this.element.scrollTop + y;
    this.scrollTo(left, top);
  }

  prepareReset(): void {
    scrolling = true;
    if (lastTimeoutId) {
      clearTimeout(lastTimeoutId);
      lastTimeoutId = null;
    }
    lastTimeoutId = window.setTimeout(resetScrolling, 100);
  }
}

export type Point = { x: number; y: number };

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
    const target = scrollTarget(Direction.NA);
    return { x: target.scrollLeft, y: target.scrollTop };
  }

  scrollVertically(count: number, smooth: boolean): void {
    const direction = count >= 0 ? Direction.Down : Direction.Up;
    const target = scrollTarget(direction);
    let delta = SCROLL_DELTA_Y * count;
    if (scrolling) {
      delta = SCROLL_DELTA_Y * count * 4;
    }
    new Scroller(target, smooth).scrollBy(0, delta);
  }

  scrollHorizonally(count: number, smooth: boolean): void {
    const direction = count >= 0 ? Direction.Right : Direction.Left;
    const target = scrollTarget(direction);
    let delta = SCROLL_DELTA_X * count;
    if (scrolling) {
      delta = SCROLL_DELTA_X * count * 4;
    }
    new Scroller(target, smooth).scrollBy(delta, 0);
  }

  scrollPages(count: number, smooth: boolean): void {
    const direction = count >= 0 ? Direction.Down : Direction.Up;
    const target = scrollTarget(direction);
    const height = target.clientHeight;
    let delta = height * count;
    if (scrolling) {
      delta = height * count;
    }
    new Scroller(target, smooth).scrollBy(0, delta);
  }

  scrollTo(x: number, y: number, smooth: boolean): void {
    const target = scrollTarget(Direction.NA);
    new Scroller(target, smooth).scrollTo(x, y);
  }

  scrollToTop(smooth: boolean): void {
    const target = scrollTarget(Direction.Up);
    const x = target.scrollLeft;
    const y = 0;
    new Scroller(target, smooth).scrollTo(x, y);
  }

  scrollToBottom(smooth: boolean): void {
    const target = scrollTarget(Direction.Down);
    const x = target.scrollLeft;
    const y = target.scrollHeight;
    new Scroller(target, smooth).scrollTo(x, y);
  }

  scrollToHome(smooth: boolean): void {
    const target = scrollTarget(Direction.Left);
    const x = 0;
    const y = target.scrollTop;
    new Scroller(target, smooth).scrollTo(x, y);
  }

  scrollToEnd(smooth: boolean): void {
    const target = scrollTarget(Direction.Right);
    const x = target.scrollWidth;
    const y = target.scrollTop;
    new Scroller(target, smooth).scrollTo(x, y);
  }
}
