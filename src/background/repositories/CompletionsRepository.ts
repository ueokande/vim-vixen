import { injectable } from 'tsyringe';

type Tab = browser.tabs.Tab;

@injectable()
export default class CompletionsRepository {
  async queryTabs(keywords: string, excludePinned: boolean): Promise<Tab[]> {
    const tabs = await browser.tabs.query({ currentWindow: true });
    return tabs.filter((t) => {
      return t.url && t.url.toLowerCase().includes(keywords.toLowerCase()) ||
        t.title && t.title.toLowerCase().includes(keywords.toLowerCase());
    }).filter((t) => {
      return !(excludePinned && t.pinned);
    });
  }
}
