import LinkInteractor from '../usecases/link';

export default class LinkController {
  constructor() {
    this.linkInteractor = new LinkInteractor();
  }

  openToTab(url, tabId) {
    this.linkInteractor.openToTab(url, tabId);
  }

  openNewTab(url, openerId, background) {
    this.linkInteractor.openNewTab(url, openerId, background);
  }
}
