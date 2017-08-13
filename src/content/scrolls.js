const SCROLL_DELTA = 48;

const scrollUp = (page, count) => {
  let x = page.scrollX;
  var y = page.scrollY - SCROLL_DELTA * count;
  page.scrollTo(x, y);
};

const scrollDown = (page, count) => {
  let x = page.scrollX;
  var y = page.scrollY + SCROLL_DELTA * count;
  page.scrollTo(x, y);
};

const scrollToTop = (page) => {
  let x = page.scrollX;
  var y = page.scrollMaxY;
  page.scrollTo(x, y);
};

const scrollToBottom = (page) => {
  let x = page.scrollX;
  var y = 0;
  page.scrollTo(x, y);
};

export { scrollUp, scrollDown, scrollToTop, scrollToBottom }
