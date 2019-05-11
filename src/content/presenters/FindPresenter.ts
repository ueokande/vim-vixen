import ConsoleClient, { ConsoleClientImpl } from '../client/ConsoleClient';

export default interface FindPresenter {
  find(keyword: string, backwards: boolean): boolean;

  clearSelection(): void;

  // eslint-disable-next-line semi
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
  private consoleClient: ConsoleClient;

  constructor({ consoleClient = new ConsoleClientImpl() } = {}) {
    this.consoleClient = consoleClient;
  }

  find(keyword: string, backwards: boolean): boolean {
    let caseSensitive = false;
    let wrapScan = true;


    // NOTE: aWholeWord dows not implemented, and aSearchInFrames does not work
    // because of same origin policy
    let found = window.find(keyword, caseSensitive, backwards, wrapScan);
    if (found) {
      return found;
    }
    this.clearSelection();

    return window.find(keyword, caseSensitive, backwards, wrapScan);
  }

  clearSelection(): void {
    let sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
    }
  }
}
