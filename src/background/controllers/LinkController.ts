import { injectable } from "tsyringe";
import LinkUseCase from "../usecases/LinkUseCase";

@injectable()
export default class LinkController {
  constructor(private linkUseCase: LinkUseCase) {}

  openToTab(url: string, tabId: number): Promise<void> {
    return this.linkUseCase.openToTab(url, tabId);
  }

  openNewTab(
    url: string,
    openerId: number,
    background: boolean
  ): Promise<void> {
    return this.linkUseCase.openNewTab(url, openerId, background);
  }
}
