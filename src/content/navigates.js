const PREV_LINK_PATTERNS = [
  /\bprev\b/i, /\bprevious\b/i, /\bback\b/i,
  /</, /\u2039/, /\u2190/, /\xab/, /\u226a/, /<</
];
const NEXT_LINK_PATTERNS = [
  /\bnext\b/i,
  />/, /\u203a/, /\u2192/, /\xbb/, /\u226b/, />>/
];

const findLinkByPatterns = (win, patterns) => {
  let links = win.document.getElementsByTagName('a');
  return Array.prototype.find.call(links, (link) => {
    return patterns.some(ptn => ptn.test(link.textContent));
  });
};

const historyPrev = (win) => {
  win.history.back();
};

const historyNext = (win) => {
  win.history.forward();
};

const linkPrev = (win) => {
  let link = win.document.querySelector('a[rel=prev]');
  if (link) {
    return link.click();
  }
  link = findLinkByPatterns(win, PREV_LINK_PATTERNS);
  if (link) {
    link.click();
  }
};

const linkNext = (win) => {
  let link = win.document.querySelector('a[rel=next]');
  if (link) {
    return link.click();
  }
  link = findLinkByPatterns(win, NEXT_LINK_PATTERNS);
  if (link) {
    link.click();
  }
};

export { historyPrev, historyNext, linkPrev, linkNext };
