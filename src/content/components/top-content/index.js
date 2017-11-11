import CommonComponent from '../common';
import FollowController from './follow-controller';
import FindComponent from './find';
import * as consoleFrames from '../../console-frames';
import * as addonActions from '../../actions/addon';
import messages from 'shared/messages';
import * as re from 'shared/utils/re';

export default class TopContent {

  constructor(win, store) {
    this.win = win;
    this.store = store;
    this.prevBlacklist = undefined;

    new CommonComponent(win, store); // eslint-disable-line no-new
    new FollowController(win, store); // eslint-disable-line no-new
    new FindComponent(win, store); // eslint-disable-line no-new

    // TODO make component
    consoleFrames.initialize(this.win.document);

    messages.onMessage(this.onMessage.bind(this));

    this.store.subscribe(() => this.update());
  }

  update() {
    let blacklist = this.store.getState().setting.blacklist;
    if (JSON.stringify(this.prevBlacklist) !== JSON.stringify(blacklist)) {
      this.disableIfBlack(blacklist);
      this.prevBlacklist = blacklist;
    }
  }

  disableIfBlack(blacklist) {
    let loc = this.win.location;
    let partial = loc.host + loc.pathname;
    let matched = blacklist
      .map((item) => {
        let pattern = item.includes('/') ? item : item + '/*';
        return re.fromWildcard(pattern);
      })
      .some(regex => regex.test(partial));
    if (matched) {
      this.store.dispatch(addonActions.disable());
    }
  }

  onMessage(message) {
    switch (message.type) {
    case messages.CONSOLE_UNFOCUS:
      this.win.focus();
      consoleFrames.blur(window.document);
      return Promise.resolve();
    }
  }
}
