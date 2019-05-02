const REL_PATTERN: {[key: string]: RegExp} = {
  prev: /^(?:prev(?:ious)?|older)\b|\u2039|\u2190|\xab|\u226a|<</i,
  next: /^(?:next|newer)\b|\u203a|\u2192|\xbb|\u226b|>>/i,
};

// Return the last element in the document matching the supplied selector
// and the optional filter, or null if there are no matches.
// eslint-disable-next-line func-style
function selectLast<E extends Element>(
  win: Window,
  selector: string,
  filter?: (e: E) => boolean,
): E | null {
  let nodes = Array.from(
    win.document.querySelectorAll(selector) as NodeListOf<E>
  );

  if (filter) {
    nodes = nodes.filter(filter);
  }
  return nodes.length ? nodes[nodes.length - 1] : null;
}

const historyPrev = (win: Window): void => {
  win.history.back();
};

const historyNext = (win: Window): void => {
  win.history.forward();
};

// Code common to linkPrev and linkNext which navigates to the specified page.
const linkRel = (win: Window, rel: string): void => {
  let link = selectLast<HTMLLinkElement>(win, `link[rel~=${rel}][href]`);
  if (link) {
    win.location.href = link.href;
    return;
  }

  const pattern = REL_PATTERN[rel];

  let a = selectLast<HTMLAnchorElement>(win, `a[rel~=${rel}][href]`) ||
    // `innerText` is much slower than `textContent`, but produces much better
    // (i.e. less unexpected) results
    selectLast(win, 'a[href]', lnk => pattern.test(lnk.innerText));

  if (a) {
    a.click();
  }
};

const linkPrev = (win: Window): void => {
  linkRel(win, 'prev');
};

const linkNext = (win: Window): void => {
  linkRel(win, 'next');
};

const parent = (win: Window): void => {
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

const root = (win: Window): void => {
  win.location.href = win.location.origin;
};

export { historyPrev, historyNext, linkPrev, linkNext, parent, root };
