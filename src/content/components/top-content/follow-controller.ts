import * as followControllerActions from '../../actions/follow-controller';
import * as messages from '../../../shared/messages';
import MessageListener from '../../MessageListener';
import HintKeyProducer from '../../hint-key-producer';

import { SettingRepositoryImpl } from '../../repositories/SettingRepository';
import FollowSlaveClient, { FollowSlaveClientImpl }
  from '../../client/FollowSlaveClient';

let settingRepository = new SettingRepositoryImpl();

export default class FollowController {
  private win: Window;

  private store: any;

  private state: {
    enabled?: boolean;
    newTab?: boolean;
    background?: boolean;
    keys?: string,
  };

  private keys: string[];

  private producer: HintKeyProducer | null;

  constructor(win: Window, store: any) {
    this.win = win;
    this.store = store;
    this.state = {};
    this.keys = [];
    this.producer = null;

    new MessageListener().onWebMessage(this.onMessage.bind(this));

    store.subscribe(() => {
      this.update();
    });
  }

  onMessage(message: messages.Message, sender: Window) {
    switch (message.type) {
    case messages.FOLLOW_START:
      return this.store.dispatch(
        followControllerActions.enable(message.newTab, message.background));
    case messages.FOLLOW_RESPONSE_COUNT_TARGETS:
      return this.create(message.count, sender);
    case messages.FOLLOW_KEY_PRESS:
      return this.keyPress(message.key, message.ctrlKey);
    }
  }

  update(): void {
    let prevState = this.state;
    this.state = this.store.getState().followController;

    if (!prevState.enabled && this.state.enabled) {
      this.count();
    } else if (prevState.enabled && !this.state.enabled) {
      this.remove();
    } else if (prevState.keys !== this.state.keys) {
      this.updateHints();
    }
  }

  updateHints(): void {
    let shown = this.keys.filter((key) => {
      return key.startsWith(this.state.keys as string);
    });
    if (shown.length === 1) {
      this.activate();
      this.store.dispatch(followControllerActions.disable());
    }

    this.broadcastMessage((c: FollowSlaveClient) => {
      c.filterHints(this.state.keys!!);
    });
  }

  activate(): void {
    this.broadcastMessage((c: FollowSlaveClient) => {
      c.activateIfExists(
        this.state.keys!!,
        this.state.newTab!!,
        this.state.background!!);
    });
  }

  keyPress(key: string, ctrlKey: boolean): boolean {
    if (key === '[' && ctrlKey) {
      this.store.dispatch(followControllerActions.disable());
      return true;
    }
    switch (key) {
    case 'Enter':
      this.activate();
      this.store.dispatch(followControllerActions.disable());
      break;
    case 'Esc':
      this.store.dispatch(followControllerActions.disable());
      break;
    case 'Backspace':
    case 'Delete':
      this.store.dispatch(followControllerActions.backspace());
      break;
    default:
      if (this.hintchars().includes(key)) {
        this.store.dispatch(followControllerActions.keyPress(key));
      }
      break;
    }
    return true;
  }

  count() {
    this.producer = new HintKeyProducer(this.hintchars());
    let doc = this.win.document;
    let viewWidth = this.win.innerWidth || doc.documentElement.clientWidth;
    let viewHeight = this.win.innerHeight || doc.documentElement.clientHeight;
    let frameElements = this.win.document.querySelectorAll('iframe');

    new FollowSlaveClientImpl(this.win).requestHintCount(
      { width: viewWidth, height: viewHeight },
      { x: 0, y: 0 });

    for (let ele of Array.from(frameElements)) {
      let { left: frameX, top: frameY } = ele.getBoundingClientRect();
      new FollowSlaveClientImpl(ele.contentWindow!!).requestHintCount(
        { width: viewWidth, height: viewHeight },
        { x: frameX, y: frameY },
      );
    }
  }

  create(count: number, sender: Window) {
    let produced = [];
    for (let i = 0; i < count; ++i) {
      produced.push((this.producer as HintKeyProducer).produce());
    }
    this.keys = this.keys.concat(produced);

    let doc = this.win.document;
    let viewWidth = this.win.innerWidth || doc.documentElement.clientWidth;
    let viewHeight = this.win.innerHeight || doc.documentElement.clientHeight;
    let pos = { x: 0, y: 0 };
    if (sender !== window) {
      let frameElements = this.win.document.querySelectorAll('iframe');
      let ele = Array.from(frameElements).find(e => e.contentWindow === sender);
      if (!ele) {
        // elements of the sender is gone
        return;
      }
      let { left: frameX, top: frameY } = ele.getBoundingClientRect();
      pos = { x: frameX, y: frameY };
    }
    new FollowSlaveClientImpl(sender).createHints(
      { width: viewWidth, height: viewHeight },
      pos,
      produced,
    );
  }

  remove() {
    this.keys = [];
    this.broadcastMessage((c: FollowSlaveClient) => {
      c.clearHints();
    });
  }

  private hintchars() {
    return settingRepository.get().properties.hintchars;
  }

  private broadcastMessage(f: (clinet: FollowSlaveClient) => void) {
    let windows = [window.self].concat(Array.from(window.frames as any));
    windows
      .map(w => new FollowSlaveClientImpl(w))
      .forEach(c => f(c));
  }
}
