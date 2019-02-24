import LinkUseCase from '../usecases/LinkUseCase';

export default class LinkController {
  constructor() {
    this.linkUseCase = new LinkUseCase();
  }

  openToTab(url, tabId) {
    this.linkUseCase.openToTab(url, tabId);
  }

  openNewTab(url, openerId, background) {
    this.linkUseCase.openNewTab(url, openerId, background);
  }
}
