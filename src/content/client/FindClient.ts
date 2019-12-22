import * as messages from '../../shared/messages';

export default interface FindClient {
  getGlobalLastKeyword(): Promise<string | null>;

  setGlobalLastKeyword(keyword: string): Promise<void>;
}

export class FindClientImpl implements FindClient {
  async getGlobalLastKeyword(): Promise<string | null> {
    const keyword = await browser.runtime.sendMessage({
      type: messages.FIND_GET_KEYWORD,
    });
    return keyword as string;
  }

  async setGlobalLastKeyword(keyword: string): Promise<void> {
    await browser.runtime.sendMessage({
      type: messages.FIND_SET_KEYWORD,
      keyword: keyword,
    });
  }
}
