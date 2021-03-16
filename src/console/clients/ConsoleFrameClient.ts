import * as messages from "../../shared/messages";

export default class ConsoleFrameClient {
  async resize(width: number, height: number): Promise<void> {
    await browser.runtime.sendMessage({
      type: messages.CONSOLE_RESIZE,
      width,
      height,
    });
  }
}
