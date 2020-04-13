import { inject, injectable } from "tsyringe";
import TabPresenter from "../presenters/TabPresenter";

@injectable()
export default class LinkUseCase {
  constructor(@inject("TabPresenter") private tabPresenter: TabPresenter) {}

  openToTab(url: string, tabId: number): Promise<any> {
    return this.tabPresenter.open(url, tabId);
  }

  async openNewTab(
    url: string,
    openerId: number,
    background: boolean
  ): Promise<any> {
    const properties: any = { active: !background };

    const platform = await browser.runtime.getPlatformInfo();
    if (platform.os !== "android") {
      // openerTabId not supported on Android
      properties.openerTabId = openerId;
    }

    return this.tabPresenter.create(url, properties);
  }
}
