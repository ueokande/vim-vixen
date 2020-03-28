import { inject, injectable } from "tsyringe";
import TabItem from "./TabItem";
import TabRepository from "./TabRepository";
import TabPresenter from "../presenters/TabPresenter";
import TabFlag from "../../shared/TabFlag";

@injectable()
export default class TabCompletionUseCase {
  constructor(
      @inject('TabRepository') private tabRepository: TabRepository,
      @inject('TabPresenter') private tabPresenter: TabPresenter,
  ) {
  }

  async queryTabs(query: string, excludePinned: boolean): Promise<TabItem[]> {
    const lastTabId = await this.tabPresenter.getLastSelectedId();
    const tabs = await this.tabRepository.queryTabs(query, excludePinned);
    return tabs.map(tab => {
      let flag = TabFlag.None;
      if (tab.active) {
        flag = TabFlag.CurrentTab
      } else if (tab.id == lastTabId) {
        flag = TabFlag.LastTab
      }
      return {
        index: tab.index + 1,
        flag: flag,
        title: tab.title,
        url: tab.url,
        faviconUrl : tab.faviconUrl
      }
    });
  }
}
