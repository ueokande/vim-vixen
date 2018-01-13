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

const easing = (t) => {
  if (t < 1) {
    return t * t;
  }
  return -(t - 1) * (t - 1) + 1;
};

const smoothScroll = (element, x, y) => {

  let startX = element.scrollTop;
  let startY = element.scrollTop;

  let distanceX = x - startX;
  let distanceY = y - startY;
  let timeStart = 0;

  const loop = (timeCurrent) => {
    if (!timeStart) {
      timeStart = timeCurrent;
    }

    let timeElapsed = timeCurrent - timeStart;
    let t = timeElapsed / SMOOTH_SCROLL_DURATION;
    let nextX = startX + distanceX * easing(t);
    let nextY = startY + distanceY * easing(t);

    window.scrollTo(nextX, nextY);

    if (timeElapsed < SMOOTH_SCROLL_DURATION) {
      window.requestAnimationFrame(loop);
    } else {
      element.scrollTo(x, y);
    }
  };

  window.requestAnimationFrame(loop);
};

const roughScroll = (element, x, y) => {
  element.scrollTo(x, y);
};

const scroll = (element, x, y, smooth) => {
  if (smooth) {
    smoothScroll(element, x, y);
  } else {
    roughScroll(element, x, y);
  }
};

const scrollVertically = (count, smooth) => {
  let target = scrollTarget();
  let x = target.scrollLeft;
  let y = target.scrollTop + SCROLL_DELTA_Y * count;
  scroll(target, x, y, smooth);
};

const scrollHorizonally = (count, smooth) => {
  let target = scrollTarget();
  let x = target.scrollLeft + SCROLL_DELTA_X * count;
  let y = target.scrollTop;
  scroll(target, x, y, smooth);
};

const scrollPages = (count, smooth) => {
  let target = scrollTarget();
  let height = target.clientHeight;
  let x = target.scrollLeft;
  let y = target.scrollTop + height * count;
  scroll(target, x, y, smooth);
};

const scrollTop = (smooth) => {
  let target = scrollTarget();
  let x = target.scrollLeft;
  let y = 0;
  scroll(target, x, y, smooth);
};

const scrollBottom = (smooth) => {
  let target = scrollTarget();
  let x = target.scrollLeft;
  let y = target.scrollHeight;
  scroll(target, x, y, smooth);
};

const scrollHome = (smooth) => {
  let target = scrollTarget();
  let x = 0;
  let y = target.scrollTop;
  scroll(target, x, y, smooth);
};

const scrollEnd = (smooth) => {
  let target = scrollTarget();
  let x = target.scrollWidth;
  let y = target.scrollTop;
  scroll(target, x, y, smooth);
};

export {
  scrollVertically, scrollHorizonally, scrollPages,
  scrollTop, scrollBottom, scrollHome, scrollEnd
};
