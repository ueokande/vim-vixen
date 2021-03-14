import * as messages from "../../shared/messages";

export default interface ConsoleFrameClient {
  resize(tabId: number, width: number, height: number): Promise<void>;
}

export class ConsoleFrameClientImpl implements ConsoleFrameClient {
  async resize(tabId: number, width: number, height: number): Promise<void> {
    await browser.tabs.sendMessage(tabId, {
      type: messages.CONSOLE_RESIZE,
      width,
      height,
    });
  }
}
