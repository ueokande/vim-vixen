import { inject, injectable } from "tsyringe";
import TabPresenter from "../presenters/TabPresenter";

@injectable()
export default class LinkUseCase {
  constructor(@inject("TabPresenter") private tabPresenter: TabPresenter) {}

  async openToTab(url: string, tabId: number): Promise<void> {
    await this.tabPresenter.open(url, tabId);
  }

  async openNewTab(
    url: string,
    openerId: number,
    background: boolean
  ): Promise<void> {
    const properties: any = { active: !background };

    const platform = await browser.runtime.getPlatformInfo();
    if (platform.os !== "android") {
      // openerTabId not supported on Android
      properties.openerTabId = openerId;
    }

    await this.tabPresenter.create(url, properties);
  }
}
