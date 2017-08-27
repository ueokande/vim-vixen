const SCROLL_DELTA = 48;

const scrollLines = (page, count) => {
  let x = page.scrollX;
  let y = page.scrollY + SCROLL_DELTA * count;
  page.scrollTo(x, y);
};

const scrollPages = (page, count) => {
  let height = page.innerHeight;
  let x = page.scrollX;
  let y = page.scrollY + height * count;
  page.scrollTo(x, y);
};

const scrollTop = (page) => {
  let x = page.scrollX;
  let y = 0;
  page.scrollTo(x, y);
};

const scrollBottom = (page) => {
  let x = page.scrollX;
  let y = page.scrollMaxY;
  page.scrollTo(x, y);
};

export { scrollLines, scrollPages, scrollTop, scrollBottom }
