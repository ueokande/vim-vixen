const PREV_LINK_PATTERNS = [
  /\bprev\b/i, /\bprevious\b/i, /\bback\b/i,
  /</, /\u2039/, /\u2190/, /\xab/, /\u226a/, /<</
];

const NEXT_LINK_PATTERNS = [
  /\bnext\b/i,
  />/, /\u203a/, /\u2192/, /\xbb/, /\u226b/, />>/
];

const findLinkByPatterns = (win, patterns) => {
  const links = win.document.getElementsByTagName('a');
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

const linkCommon = (win, rel, patterns) => {
  let link = win.document.querySelector(`link[rel~=${rel}][href]`);

  if (link) {
    win.location = link.getAttribute('href');
    return;
  }

  link = win.document.querySelector(`a[rel~=${rel}]`) ||
    findLinkByPatterns(win, patterns);

  if (link) {
    link.click();
  }
};

const linkPrev = (win) => {
  linkCommon(win, 'prev', PREV_LINK_PATTERNS);
};

const linkNext = (win) => {
  linkCommon(win, 'next', NEXT_LINK_PATTERNS);
};

const parent = (win) => {
  const loc = win.location;
  if (loc.hash !== '') {
    loc.hash = '';
    return;
  } else if (loc.search !== '') {
    loc.search = '';
    return;
  }

  const basenamePattern = /\/[^/]+$/;
  const lastDirPattern = /\/[^/]+\/$/;
  if (basenamePattern.test(loc.pathname)) {
    loc.pathname = loc.pathname.replace(basenamePattern, '/');
  } else if (lastDirPattern.test(loc.pathname)) {
    loc.pathname = loc.pathname.replace(lastDirPattern, '/');
  }
};

const root = (win) => {
  win.location = win.location.origin;
};

export { historyPrev, historyNext, linkPrev, linkNext, parent, root };
