import LinkUseCase from '../usecases/LinkUseCase';

export default class LinkController {
  private linkUseCase: LinkUseCase;

  constructor() {
    this.linkUseCase = new LinkUseCase();
  }

  openToTab(url: string, tabId: number): Promise<void> {
    return this.linkUseCase.openToTab(url, tabId);
  }

  openNewTab(
    url: string, openerId: number, background: boolean,
  ): Promise<void> {
    return this.linkUseCase.openNewTab(url, openerId, background);
  }
}
