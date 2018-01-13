const SCROLL_DELTA_X = 48;
const SCROLL_DELTA_Y = 48;
const SMOOTH_SCROLL_DURATION = 150;

const isVisible = (element) => {
  let rect = element.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    return false;
  }
  if (rect.right < 0 && rect.bottom < 0) {
    return false;
  }
  if (window.innerWidth < rect.left && window.innerHeight < rect.top) {
    return false;
  }

  let { display, visibility } = window.getComputedStyle(element);
  if (display === 'none' || visibility === 'hidden') {
    return false;
  }
  return true;
};

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

  let children = Array.prototype
    .filter.call(element.children, e => isVisible(e));
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
  constructor(element) {
    this.element = element;
  }

  scroll(x, y) {
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
      this.element.scrollTo(this.targetX, this.targetY);
    }
  }

  // in-out quad easing
  easing(t) {
    if (t < 1) {
      return t * t;
    }
    return -(t - 1) * (t - 1) + 1;
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

const scrollVertically = (count, smooth) => {
  let target = scrollTarget();
  let x = target.scrollLeft;
  let y = target.scrollTop + SCROLL_DELTA_Y * count;
  scroller(target, smooth).scroll(x, y);
};

const scrollHorizonally = (count, smooth) => {
  let target = scrollTarget();
  let x = target.scrollLeft + SCROLL_DELTA_X * count;
  let y = target.scrollTop;
  scroller(target, smooth).scroll(x, y);
};

const scrollPages = (count, smooth) => {
  let target = scrollTarget();
  let height = target.clientHeight;
  let x = target.scrollLeft;
  let y = target.scrollTop + height * count;
  scroller(target, smooth).scroll(x, y);
};

const scrollTop = (smooth) => {
  let target = scrollTarget();
  let x = target.scrollLeft;
  let y = 0;
  scroller(target, smooth).scroll(x, y);
};

const scrollBottom = (smooth) => {
  let target = scrollTarget();
  let x = target.scrollLeft;
  let y = target.scrollHeight;
  scroller(target, smooth).scroll(x, y);
};

const scrollHome = (smooth) => {
  let target = scrollTarget();
  let x = 0;
  let y = target.scrollTop;
  scroller(target, smooth).scroll(x, y);
};

const scrollEnd = (smooth) => {
  let target = scrollTarget();
  let x = target.scrollWidth;
  let y = target.scrollTop;
  scroller(target, smooth).scroll(x, y);
};

export {
  scrollVertically, scrollHorizonally, scrollPages,
  scrollTop, scrollBottom, scrollHome, scrollEnd
};
