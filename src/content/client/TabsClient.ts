import * as messages from '../../shared/messages';

export default interface TabsClient {
  openUrl(url: string, newTab: boolean, background?: boolean): Promise<void>;

  // eslint-disable-next-line semi
}

export class TabsClientImpl implements TabsClient {
  async openUrl(
    url: string,
    newTab: boolean,
    background?: boolean,
  ): Promise<void> {
    await browser.runtime.sendMessage({
      type: messages.OPEN_URL,
      url,
      newTab,
      background,
    });
  }
}
