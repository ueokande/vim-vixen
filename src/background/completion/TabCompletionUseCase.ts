import { inject, injectable } from "tsyringe";
import TabItem from "./TabItem";
import TabRepository, { Tab } from "./TabRepository";
import TabPresenter from "../presenters/TabPresenter";
import TabFlag from "../../shared/TabFlag";

@injectable()
export default class TabCompletionUseCase {
  constructor(
    @inject("TabRepository") private tabRepository: TabRepository,
    @inject("TabPresenter") private tabPresenter: TabPresenter
  ) {}

  async queryTabs(query: string, excludePinned: boolean, onlyCurrentWin: boolean): Promise<TabItem[]> {
    const multiIndex = (t: Tab) => t.index + 1 + parseFloat('0.' + t.windowId + '1')
    const lastTabId = await this.tabPresenter.getLastSelectedId();
    const allTabs = await this.tabRepository.getAllTabs(excludePinned, onlyCurrentWin);
    const num = parseFloat(query);
    let tabs: Tab[] = [];
    if (!isNaN(num)) {
      let tab = allTabs.find((t) => t.index === num - 1);
      if (!tab) {
        tab = allTabs.find((t) => multiIndex(t) === num);
      }
      if(tab) {
        tabs = [tab]
      }

    } else if (query == "%") {
      const tab = allTabs.find((t) => t.active);
      if (tab) {
        tabs = [tab];
      }
    } else if (query == "#") {
      const tab = allTabs.find((t) => t.id === lastTabId);
      if (tab) {
        tabs = [tab];
      }
    } else {
      tabs = await this.tabRepository.queryTabs(query, excludePinned, onlyCurrentWin);
    }
    const winSet = tabs.reduce( (wins, tab) => wins.add(tab.windowId), new Set<number>());
    const multiWin = winSet.size > 1

    return tabs.map((tab) => {
      let flag = TabFlag.None;
      if (tab.active) {
        flag = TabFlag.CurrentTab;
      } else if (tab.id == lastTabId) {
        flag = TabFlag.LastTab;
      }
      return {
        index: tab.index + 1 + (multiWin ? parseFloat('0.' + tab.windowId + '1') : 0),
        flag: flag,
        title: tab.title,
        url: tab.url,
        faviconUrl: tab.faviconUrl,
      };
    });
  }
}
