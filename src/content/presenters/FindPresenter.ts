export default interface FindPresenter {
  find(keyword: string, backwards: boolean): boolean;

  clearSelection(): void;
}

export class FindPresenterImpl implements FindPresenter {
  find(keyword: string, backwards: boolean): boolean {
    const caseSensitive = false;
    const wrapScan = true;

    // NOTE: aWholeWord dows not implemented, and aSearchInFrames does not work
    // because of same origin policy
    const found = window.find(keyword, caseSensitive, backwards, wrapScan);
    if (found) {
      return found;
    }
    this.clearSelection();

    return window.find(keyword, caseSensitive, backwards, wrapScan);
  }

  clearSelection(): void {
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
    }
  }
}
