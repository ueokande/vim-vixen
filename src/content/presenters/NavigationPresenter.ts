export default interface NavigationPresenter {
  openHistoryPrev(): void;

  openHistoryNext(): void;

  openLinkPrev(): void;

  openLinkNext(): void;
}

const REL_PATTERN: { [key: string]: RegExp } = {
  prev: /^(?:prev(?:ious)?|older)\b|\u2039|\u2190|\xab|\u226a|<</i,
  next: /^(?:next|newer)\b|\u203a|\u2192|\xbb|\u226b|>>/i,
};

// Return the last element in the document matching the supplied selector
// and the optional filter, or null if there are no matches.
// eslint-disable-next-line func-style
function selectLast<E extends Element>(
  selector: string,
  filter?: (e: E) => boolean
): E | null {
  let nodes = Array.from(
    window.document.querySelectorAll(selector) as NodeListOf<E>
  );

  if (filter) {
    nodes = nodes.filter(filter);
  }
  return nodes.length ? nodes[nodes.length - 1] : null;
}

export class NavigationPresenterImpl implements NavigationPresenter {
  openHistoryPrev(): void {
    window.history.back();
  }

  openHistoryNext(): void {
    window.history.forward();
  }

  openLinkPrev(): void {
    this.linkRel("prev");
  }

  openLinkNext(): void {
    this.linkRel("next");
  }

  // Code common to linkPrev and linkNext which navigates to the specified page.
  private linkRel(rel: "prev" | "next"): void {
    const link = selectLast<HTMLLinkElement>(`link[rel~=${rel}][href]`);
    if (link) {
      window.location.href = link.href;
      return;
    }

    const pattern = REL_PATTERN[rel];

    const a =
      selectLast<HTMLAnchorElement>(`a[rel~=${rel}][href]`) ||
      // `innerText` is much slower than `textContent`, but produces much better
      // (i.e. less unexpected) results
      selectLast("a[href]", (lnk) => pattern.test(lnk.innerText));

    if (a) {
      a.click();
    }
  }
}
