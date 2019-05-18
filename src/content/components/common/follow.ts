import MessageListener from '../../MessageListener';
import { LinkHint, InputHint } from '../../presenters/Hint';
import * as messages from '../../../shared/messages';
import Key from '../../domains/Key';
import TabsClient, { TabsClientImpl } from '../../client/TabsClient';
import FollowMasterClient, { FollowMasterClientImpl }
  from '../../client/FollowMasterClient';
import FollowPresenter, { FollowPresenterImpl }
  from '../../presenters/FollowPresenter';

let tabsClient: TabsClient = new TabsClientImpl();
let followMasterClient: FollowMasterClient =
  new FollowMasterClientImpl(window.top);
let followPresenter: FollowPresenter =
  new FollowPresenterImpl();

interface Size {
  width: number;
  height: number;
}

interface Point {
  x: number;
  y: number;
}

export default class Follow {
  private enabled: boolean;

  constructor() {
    this.enabled = false;

    new MessageListener().onWebMessage(this.onMessage.bind(this));
  }

  key(key: Key): boolean {
    if (!this.enabled) {
      return false;
    }
    followMasterClient.sendKey(key);
    return true;
  }

  countHints(viewSize: Size, framePosition: Point) {
    let count = followPresenter.getTargetCount(viewSize, framePosition);
    followMasterClient.responseHintCount(count);
  }

  createHints(viewSize: Size, framePosition: Point, tags: string[]) {
    this.enabled = true;
    followPresenter.createHints(viewSize, framePosition, tags);
  }

  showHints(prefix: string) {
    followPresenter.filterHints(prefix);
  }

  removeHints() {
    followPresenter.clearHints();
    this.enabled = false;
  }

  async activateHints(
    tag: string, newTab: boolean, background: boolean,
  ): Promise<void> {
    let hint = followPresenter.getHint(tag);
    if (!hint) {
      return;
    }

    if (hint instanceof LinkHint) {
      let url = hint.getLink();
      // ignore taget='_blank'
      if (!newTab && hint.getLinkTarget() !== '_blank') {
        hint.click();
        return;
      }
      // eslint-disable-next-line no-script-url
      if (!url || url === '#' || url.toLowerCase().startsWith('javascript:')) {
        return;
      }
      await tabsClient.openUrl(url, newTab, background);
    } else if (hint instanceof InputHint) {
      hint.activate();
    }
  }

  onMessage(message: messages.Message, _sender: Window) {
    switch (message.type) {
    case messages.FOLLOW_REQUEST_COUNT_TARGETS:
      return this.countHints(message.viewSize, message.framePosition);
    case messages.FOLLOW_CREATE_HINTS:
      return this.createHints(
        message.viewSize, message.framePosition, message.tags);
    case messages.FOLLOW_SHOW_HINTS:
      return this.showHints(message.prefix);
    case messages.FOLLOW_ACTIVATE:
      return this.activateHints(
        message.tag, message.newTab, message.background);
    case messages.FOLLOW_REMOVE_HINTS:
      return this.removeHints();
    }
  }
}
