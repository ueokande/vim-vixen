import * as doms from 'shared/utils/dom';

const SCROLL_DELTA_X = 48;
const SCROLL_DELTA_Y = 48;
const SMOOTH_SCROLL_DURATION = 150;

// dirty way to store scrolling state on globally
let scrolling = [false];

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

class SmoothScroller {
  constructor(element, repeat) {
    this.element = element;
    this.repeat = repeat;
    this.scrolling = scrolling;
    if (repeat) {
      this.easing = SmoothScroller.linearEasing;
    } else {
      this.easing = SmoothScroller.inOutQuadEasing;
    }
  }

  scroll(x, y) {
    if (this.scrolling[0]) {
      return;
    }
    scrolling[0] = true;

    this.startX = this.element.scrollLeft;
    this.startY = this.element.scrollTop;

    this.targetX = x;
    this.targetY = y;
    this.distanceX = x - this.startX;
    this.distanceY = y - this.startY;
    this.timeStart = 0;

    window.requestAnimationFrame(this.loop.bind(this));
  }

  loop(time) {
    if (!this.timeStart) {
      this.timeStart = time;
    }

    let elapsed = time - this.timeStart;
    let v = this.easing(elapsed / SMOOTH_SCROLL_DURATION);
    let nextX = this.startX + this.distanceX * v;
    let nextY = this.startY + this.distanceY * v;

    window.scrollTo(nextX, nextY);

    if (elapsed < SMOOTH_SCROLL_DURATION) {
      window.requestAnimationFrame(this.loop.bind(this));
    } else {
      scrolling[0] = false;
      this.element.scrollTo(this.targetX, this.targetY);
    }
  }

  static inOutQuadEasing(t) {
    if (t < 1) {
      return t * t;
    }
    return -(t - 1) * (t - 1) + 1;
  }

  static linearEasing(t) {
    return t;
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

const scroller = (element, smooth, repeat) => {
  if (smooth) {
    return new SmoothScroller(element, repeat);
  }
  return new RoughtScroller(element);
};

const scrollVertically = (count, smooth, repeat) => {
  let target = scrollTarget();
  let x = target.scrollLeft;
  let y = target.scrollTop + SCROLL_DELTA_Y * count;
  if (repeat && smooth) {
    y = target.scrollTop + SCROLL_DELTA_Y * count * 4;
  }
  scroller(target, smooth, repeat).scroll(x, y);
};

const scrollHorizonally = (count, smooth, repeat) => {
  let target = scrollTarget();
  let x = target.scrollLeft + SCROLL_DELTA_X * count;
  let y = target.scrollTop;
  if (repeat && smooth) {
    y = target.scrollTop + SCROLL_DELTA_Y * count * 4;
  }
  scroller(target, smooth, repeat).scroll(x, y);
};

const scrollPages = (count, smooth, repeat) => {
  let target = scrollTarget();
  let height = target.clientHeight;
  let x = target.scrollLeft;
  let y = target.scrollTop + height * count;
  scroller(target, smooth, repeat).scroll(x, y);
};

const scrollTop = (smooth, repeat) => {
  let target = scrollTarget();
  let x = target.scrollLeft;
  let y = 0;
  scroller(target, smooth, repeat).scroll(x, y);
};

const scrollBottom = (smooth, repeat) => {
  let target = scrollTarget();
  let x = target.scrollLeft;
  let y = target.scrollHeight;
  scroller(target, smooth, repeat).scroll(x, y);
};

const scrollHome = (smooth, repeat) => {
  let target = scrollTarget();
  let x = 0;
  let y = target.scrollTop;
  scroller(target, smooth, repeat).scroll(x, y);
};

const scrollEnd = (smooth, repeat) => {
  let target = scrollTarget();
  let x = target.scrollWidth;
  let y = target.scrollTop;
  scroller(target, smooth, repeat).scroll(x, y);
};

export {
  scrollVertically, scrollHorizonally, scrollPages,
  scrollTop, scrollBottom, scrollHome, scrollEnd
};
