import { injectable } from "tsyringe";
import { Message, valueOf } from "../shared/messages";

export type WebExtMessageSender = browser.runtime.MessageSender;

@injectable()
export default class MessageListener {
  onWebMessage(listener: (msg: Message, sender: Window) => void) {
    window.addEventListener("message", (event: MessageEvent) => {
      const sender = event.source;
      if (!(sender instanceof Window)) {
        return;
      }
      let message = null;
      try {
        message = JSON.parse(event.data);
      } catch (e) {
        // ignore unexpected message
        return;
      }
      listener(message, sender);
    });
  }

  onBackgroundMessage(
    listener: (msg: Message, sender: WebExtMessageSender) => any
  ) {
    browser.runtime.onMessage.addListener(
      (msg: any, sender: WebExtMessageSender) => {
        return listener(valueOf(msg), sender);
      }
    );
  }
}
