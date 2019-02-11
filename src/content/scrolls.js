import * as doms from 'shared/utils/dom';

const SCROLL_DELTA_X = 48;
const SCROLL_DELTA_Y = 48;

// dirty way to store scrolling state on globally
let scrolling = false;
let lastTimeoutId = null;

const isScrollableStyle = (element) => {
  let { overflowX, overflowY } = window.getComputedStyle(element);
  return !(overflowX !== 'scroll' && overflowX !== 'auto' &&
    overflowY !== 'scroll' && overflowY !== 'auto');
};

const isOverflowed = (element) => {
  return element.scrollWidth > element.clientWidth ||
    element.scrollHeight > element.clientHeight;
};

// Find a visiable and scrollable element by depth-first search.  Currently
// this method is called by each scrolling, and the returned value of this
// method is not cached.  That does not cause performance issue because in the
// most pages, the window is root element i,e, documentElement.
const findScrollable = (element) => {
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

class SmoothScroller {
  constructor(element) {
    this.element = element;
  }

  scroll(x, y) {
    window.scrollTo({
      left: x,
      top: y,
      behavior: 'smooth',
    });
    scrolling = true;
    if (lastTimeoutId) {
      clearTimeout(lastTimeoutId);
      lastTimeoutId = null;
    }
    lastTimeoutId = setTimeout(resetScrolling, 100);
  }
}

class RoughtScroller {
  constructor(element) {
    this.element = element;
  }

  scroll(x, y) {
    this.element.scrollTo(x, y);
  }
}

const scroller = (element, smooth) => {
  if (smooth) {
    return new SmoothScroller(element);
  }
  return new RoughtScroller(element);
};

const getScroll = () => {
  let target = scrollTarget();
  return { x: target.scrollLeft, y: target.scrollTop };
};

const scrollVertically = (count, smooth) => {
  let target = scrollTarget();
  let x = target.scrollLeft;
  let y = target.scrollTop + SCROLL_DELTA_Y * count;
  if (scrolling) {
    y = target.scrollTop + SCROLL_DELTA_Y * count * 4;
  }
  scroller(target, smooth).scroll(x, y);
};

const scrollHorizonally = (count, smooth) => {
  let target = scrollTarget();
  let x = target.scrollLeft + SCROLL_DELTA_X * count;
  let y = target.scrollTop;
  if (scrolling) {
    y = target.scrollTop + SCROLL_DELTA_Y * count * 4;
  }
  scroller(target, smooth).scroll(x, y);
};

const scrollPages = (count, smooth) => {
  let target = scrollTarget();
  let height = target.clientHeight;
  let x = target.scrollLeft;
  let y = target.scrollTop + height * count;
  if (scrolling) {
    y = target.scrollTop + height * count * 4;
  }
  scroller(target, smooth).scroll(x, y);
};

const scrollTo = (x, y, smooth) => {
  let target = scrollTarget();
  scroller(target, smooth, false).scroll(x, y);
};

const scrollToTop = (smooth) => {
  let target = scrollTarget();
  let x = target.scrollLeft;
  let y = 0;
  scroller(target, smooth, false).scroll(x, y);
};

const scrollToBottom = (smooth) => {
  let target = scrollTarget();
  let x = target.scrollLeft;
  let y = target.scrollHeight;
  scroller(target, smooth, false).scroll(x, y);
};

const scrollToHome = (smooth) => {
  let target = scrollTarget();
  let x = 0;
  let y = target.scrollTop;
  scroller(target, smooth, false).scroll(x, y);
};

const scrollToEnd = (smooth) => {
  let target = scrollTarget();
  let x = target.scrollWidth;
  let y = target.scrollTop;
  scroller(target, smooth, false).scroll(x, y);
};

export {
  getScroll,
  scrollVertically, scrollHorizonally, scrollPages,
  scrollTo,
  scrollToTop, scrollToBottom, scrollToHome, scrollToEnd
};
