import CommonComponent from '../common';
import FollowController from './follow-controller';
import FindComponent from './find';
import * as consoleFrames from '../../console-frames';
import messages from 'shared/messages';
import * as scrolls from 'content/scrolls';

export default class TopContent {

  constructor(win, store) {
    this.win = win;
    this.store = store;

    new CommonComponent(win, store); // eslint-disable-line no-new
    new FollowController(win, store); // eslint-disable-line no-new
    new FindComponent(win, store); // eslint-disable-line no-new

    // TODO make component
    consoleFrames.initialize(this.win.document);

    messages.onMessage(this.onMessage.bind(this));
  }

  onMessage(message) {
    let addonState = this.store.getState().addon;

    switch (message.type) {
    case messages.CONSOLE_UNFOCUS:
      this.win.focus();
      consoleFrames.blur(window.document);
      return Promise.resolve();
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
