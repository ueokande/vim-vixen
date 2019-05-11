import * as navigates from '../navigates';

export default class NavigateClass {
  openHistoryPrev(): void {
    navigates.historyPrev(window);
  }

  openHistoryNext(): void {
    navigates.historyNext(window);
  }

  openLinkPrev(): void {
    navigates.linkPrev(window);
  }

  openLinkNext(): void {
    navigates.linkNext(window);
  }

  openParent(): void {
    navigates.parent(window);
  }

  openRoot(): void {
    navigates.root(window);
  }
}
