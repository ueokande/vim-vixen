import * as messages from '../../shared/messages';
import Key from '../domains/Key';

export default interface FollowMasterClient {
  startFollow(newTab: boolean, background: boolean): void;

  responseHintCount(count: number): void;

  sendKey(key: Key): void;
}

export class FollowMasterClientImpl implements FollowMasterClient {
  private window: Window;

  constructor(window: Window) {
    this.window = window;
  }

  startFollow(newTab: boolean, background: boolean): void {
    this.postMessage({
      type: messages.FOLLOW_START,
      newTab,
      background,
    });
  }

  responseHintCount(count: number): void {
    this.postMessage({
      type: messages.FOLLOW_RESPONSE_COUNT_TARGETS,
      count,
    });
  }

  sendKey(key: Key): void {
    this.postMessage({
      type: messages.FOLLOW_KEY_PRESS,
      key: key.key,
      ctrlKey: key.ctrl || false,
    });
  }

  private postMessage(msg: messages.Message): void {
    this.window.postMessage(JSON.stringify(msg), '*');
  }
}
