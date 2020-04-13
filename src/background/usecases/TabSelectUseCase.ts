import { inject, injectable } from "tsyringe";
import TabPresenter from "../presenters/TabPresenter";

@injectable()
export default class TabSelectUseCase {
  constructor(@inject("TabPresenter") private tabPresenter: TabPresenter) {}

  async selectPrev(count: number): Promise<any> {
    const tabs = await this.tabPresenter.getAll();
    if (tabs.length < 2) {
      return;
    }
    const tab = tabs.find((t) => t.active);
    if (!tab) {
      return;
    }
    const select = (tab.index - count + tabs.length) % tabs.length;
    return this.tabPresenter.select(tabs[select].id as number);
  }

  async selectNext(count: number): Promise<any> {
    const tabs = await this.tabPresenter.getAll();
    if (tabs.length < 2) {
      return;
    }
    const tab = tabs.find((t) => t.active);
    if (!tab) {
      return;
    }
    const select = (tab.index + count) % tabs.length;
    return this.tabPresenter.select(tabs[select].id as number);
  }

  async selectFirst(): Promise<any> {
    const tabs = await this.tabPresenter.getAll();
    return this.tabPresenter.select(tabs[0].id as number);
  }

  async selectLast(): Promise<any> {
    const tabs = await this.tabPresenter.getAll();
    return this.tabPresenter.select(tabs[tabs.length - 1].id as number);
  }

  async selectPrevSelected(): Promise<any> {
    const tabId = await this.tabPresenter.getLastSelectedId();
    if (tabId === null || typeof tabId === "undefined") {
      return Promise.resolve();
    }
    return this.tabPresenter.select(tabId);
  }
}
