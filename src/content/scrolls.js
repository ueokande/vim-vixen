const SCROLL_DELTA_X = 48;
const SCROLL_DELTA_Y = 48;

const scrollVertically = (page, count) => {
  let x = page.scrollX;
  let y = page.scrollY + SCROLL_DELTA_X * count;
  page.scrollTo(x, y);
};

const scrollHorizonally = (page, count) => {
  let x = page.scrollX + SCROLL_DELTA_Y * count;
  let y = page.scrollY;
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

const scrollHome = (page) => {
  let x = 0;
  let y = page.scrollY;
  page.scrollTo(x, y);
};

const scrollEnd = (page) => {
  let x = page.scrollMaxX;
  let y = page.scrollY;
  page.scrollTo(x, y);
};

export {
  scrollVertically, scrollHorizonally, scrollPages,
  scrollTop, scrollBottom, scrollHome, scrollEnd
};
