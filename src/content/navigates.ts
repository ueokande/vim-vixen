const REL_PATTERN = {
  prev: /^(?:prev(?:ious)?|older)\b|\u2039|\u2190|\xab|\u226a|<</i,
  next: /^(?:next|newer)\b|\u203a|\u2192|\xbb|\u226b|>>/i,
};

// Return the last element in the document matching the supplied selector
// and the optional filter, or null if there are no matches.
const selectLast = (win, selector, filter) => {
  let nodes = win.document.querySelectorAll(selector);

  if (filter) {
    nodes = Array.from(nodes).filter(filter);
  }

  return nodes.length ? nodes[nodes.length - 1] : null;
};

const historyPrev = (win) => {
  win.history.back();
};

const historyNext = (win) => {
  win.history.forward();
};

// Code common to linkPrev and linkNext which navigates to the specified page.
const linkRel = (win, rel) => {
  let link = selectLast(win, `link[rel~=${rel}][href]`);

  if (link) {
    win.location = link.href;
    return;
  }

  const pattern = REL_PATTERN[rel];

  link = selectLast(win, `a[rel~=${rel}][href]`) ||
    // `innerText` is much slower than `textContent`, but produces much better
    // (i.e. less unexpected) results
    selectLast(win, 'a[href]', lnk => pattern.test(lnk.innerText));

  if (link) {
    link.click();
  }
};

const linkPrev = (win) => {
  linkRel(win, 'prev');
};

const linkNext = (win) => {
  linkRel(win, 'next');
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
