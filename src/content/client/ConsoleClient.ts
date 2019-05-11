import * as messages from '../../shared/messages';

export default interface ConsoleClient {
  info(text: string): Promise<void>;
  error(text: string): Promise<void>;

  // eslint-disable-next-line semi
}

export class ConsoleClientImpl implements ConsoleClient {
  async info(text: string): Promise<void> {
    await browser.runtime.sendMessage({
      type: messages.CONSOLE_FRAME_MESSAGE,
      message: {
        type: messages.CONSOLE_SHOW_INFO,
        text,
      },
    });
  }

  async error(text: string): Promise<void> {
    await browser.runtime.sendMessage({
      type: messages.CONSOLE_FRAME_MESSAGE,
      message: {
        type: messages.CONSOLE_SHOW_ERROR,
        text,
      },
    });
  }
}
