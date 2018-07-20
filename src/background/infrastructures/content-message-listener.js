import messages from '../../shared/messages';
import CompletionsController from '../controllers/completions';

export default class ContentMessageListener {
  constructor() {
    this.completionsController = new CompletionsController();
  }

  run() {
    browser.runtime.onMessage.addListener((message, sender) => {
      try {
        return this.onMessage(message, sender);
      } catch (e) {
        return browser.tabs.sendMessage(sender.tab.id, {
          type: messages.CONSOLE_SHOW_ERROR,
          text: e.message,
        });
      }
    });
  }

  onMessage(message) {
    switch (message.type) {
    case messages.CONSOLE_QUERY_COMPLETIONS:
      return this.onConsoleQueryCompletions(message);
    }
  }

  async onConsoleQueryCompletions(message) {
    let completions =
      await this.completionsController.getCompletions(message.text);
    return Promise.resolve(completions.serialize());
  }
}
