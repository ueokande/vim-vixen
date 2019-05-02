import CommonComponent from '../common';
import FollowController from './follow-controller';
import FindComponent from './find';
import * as consoleFrames from '../../console-frames';
import * as messages from '../../../shared/messages';
import MessageListener from '../../MessageListener';
import * as scrolls from '../../scrolls';

export default class TopContent {
  private win: Window;

  private store: any;

  constructor(win: Window, store: any) {
    this.win = win;
    this.store = store;

    new CommonComponent(win, store); // eslint-disable-line no-new
    new FollowController(win, store); // eslint-disable-line no-new
    new FindComponent(store); // eslint-disable-line no-new

    // TODO make component
    consoleFrames.initialize(this.win.document);

    new MessageListener().onWebMessage(this.onWebMessage.bind(this));
    new MessageListener().onBackgroundMessage(
      this.onBackgroundMessage.bind(this));
  }

  onWebMessage(message: messages.Message) {
    switch (message.type) {
    case messages.CONSOLE_UNFOCUS:
      this.win.focus();
      consoleFrames.blur(window.document);
    }
  }

  onBackgroundMessage(message: messages.Message) {
    let addonState = this.store.getState().addon;

    switch (message.type) {
    case messages.ADDON_ENABLED_QUERY:
      return Promise.resolve({
        type: messages.ADDON_ENABLED_RESPONSE,
        enabled: addonState.enabled,
      });
    case messages.TAB_SCROLL_TO:
      return scrolls.scrollTo(message.x, message.y, false);
    }
  }
}
