import { inject, injectable } from "tsyringe";
import TabPresenter from "../presenters/TabPresenter";
import WindowPresenter from "../presenters/WindowPresenter";
import BrowserSettingRepository from "../repositories/BrowserSettingRepository";

@injectable()
export default class TabUseCase {
  constructor(
    @inject("TabPresenter") private tabPresenter: TabPresenter,
    private windowPresenter: WindowPresenter,
    private browserSettingRepository: BrowserSettingRepository
  ) {}

  async close(force: boolean, selectLeft = false): Promise<any> {
    const tab = await this.tabPresenter.getCurrent();
    if (!force && tab.pinned) {
      return Promise.resolve();
    }
    if (selectLeft && tab.index > 0) {
      const tabs = await this.tabPresenter.getAll();
      await this.tabPresenter.select(tabs[tab.index - 1].id as number);
    }
    return this.tabPresenter.remove([tab.id as number]);
  }

  async closeRight(): Promise<any> {
    const tabs = await this.tabPresenter.getAll();
    tabs.sort((t1, t2) => t1.index - t2.index);
    const index = tabs.findIndex((t) => t.active);
    if (index < 0) {
      return;
    }
    for (let i = index + 1; i < tabs.length; ++i) {
      const tab = tabs[i];
      if (!tab.pinned) {
        this.tabPresenter.remove([tab.id as number]);
      }
    }
  }

  reopen(): Promise<any> {
    return this.tabPresenter.reopen();
  }

  async reload(cache: boolean): Promise<any> {
    const tab = await this.tabPresenter.getCurrent();
    return this.tabPresenter.reload(tab.id as number, cache);
  }

  async setPinned(pinned: boolean): Promise<any> {
    const tab = await this.tabPresenter.getCurrent();
    return this.tabPresenter.setPinned(tab.id as number, pinned);
  }

  async togglePinned(): Promise<any> {
    const tab = await this.tabPresenter.getCurrent();
    return this.tabPresenter.setPinned(tab.id as number, !tab.pinned);
  }

  async duplicate(): Promise<any> {
    const tab = await this.tabPresenter.getCurrent();
    return this.tabPresenter.duplicate(tab.id as number);
  }

  async openPageSource(): Promise<any> {
    const tab = await this.tabPresenter.getCurrent();
    const url = "view-source:" + tab.url;
    return this.tabPresenter.create(url);
  }

  async openHome(newTab: boolean): Promise<any> {
    const tab = await this.tabPresenter.getCurrent();
    const urls = await this.browserSettingRepository.getHomepageUrls();
    if (urls.length === 1 && urls[0] === "about:home") {
      // eslint-disable-next-line max-len
      throw new Error(
        "Cannot open Firefox Home (about:home) by WebExtensions, set your custom URLs"
      );
    }
    if (urls.length === 1 && !newTab) {
      return this.tabPresenter.open(urls[0], tab.id);
    }
    for (const url of urls) {
      this.tabPresenter.create(url);
    }
  }

  async openURL(
    url: string,
    newTab?: boolean,
    newWindow?: boolean
  ): Promise<void> {
    if (newWindow) {
      await this.windowPresenter.create(url);
    } else if (newTab) {
      await this.tabPresenter.create(url);
    } else {
      const tab = await this.tabPresenter.getCurrent();
      await this.tabPresenter.open(url, tab.id);
    }
  }
}
