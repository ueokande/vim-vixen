import { Message, valueOf } from '../shared/messages';

export type WebMessageSender = Window | MessagePort | ServiceWorker | null;
export type WebExtMessageSender = browser.runtime.MessageSender;

export default class MessageListener {
  onWebMessage(
    listener: (msg: Message, sender: WebMessageSender) => void,
  ) {
    window.addEventListener('message', (event: MessageEvent) => {
      let sender = event.source;
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
    listener: (msg: Message, sender: WebExtMessageSender) => any,
  ) {
    browser.runtime.onMessage.addListener(
      (msg: any, sender: WebExtMessageSender) => {
        listener(valueOf(msg), sender);
      },
    );
  }
}
