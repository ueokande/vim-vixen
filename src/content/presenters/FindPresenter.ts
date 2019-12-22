
export default interface FindPresenter {
  find(keyword: string, backwards: boolean): boolean;

  clearSelection(): void;
}

// window.find(aString, aCaseSensitive, aBackwards, aWrapAround,
//             aWholeWord, aSearchInFrames);
//
// NOTE: window.find is not standard API
// https://developer.mozilla.org/en-US/docs/Web/API/Window/find
interface MyWindow extends Window {
  find(
    aString: string,
    aCaseSensitive?: boolean,
    aBackwards?: boolean,
    aWrapAround?: boolean,
    aWholeWord?: boolean,
    aSearchInFrames?: boolean,
    aShowDialog?: boolean): boolean;
}

// eslint-disable-next-line no-var, vars-on-top, init-declarations
declare var window: MyWindow;

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
