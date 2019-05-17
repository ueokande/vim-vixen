import * as followControllerActions from '../../actions/follow-controller';
import * as messages from '../../../shared/messages';
import MessageListener, { WebMessageSender } from '../../MessageListener';
import HintKeyProducer from '../../hint-key-producer';

import { SettingRepositoryImpl } from '../../repositories/SettingRepository';

let settingRepository = new SettingRepositoryImpl();

const broadcastMessage = (win: Window, message: messages.Message): void => {
  let json = JSON.stringify(message);
  let frames = [win.self].concat(Array.from(win.frames as any));
  frames.forEach(frame => frame.postMessage(json, '*'));
};

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

  onMessage(message: messages.Message, sender: WebMessageSender) {
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

    broadcastMessage(this.win, {
      type: messages.FOLLOW_SHOW_HINTS,
      keys: this.state.keys as string,
    });
  }

  activate(): void {
    broadcastMessage(this.win, {
      type: messages.FOLLOW_ACTIVATE,
      keys: this.state.keys as string,
      newTab: this.state.newTab!!,
      background: this.state.background!!,
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
    let frameElements = this.win.document.querySelectorAll('frame,iframe');

    this.win.postMessage(JSON.stringify({
      type: messages.FOLLOW_REQUEST_COUNT_TARGETS,
      viewSize: { width: viewWidth, height: viewHeight },
      framePosition: { x: 0, y: 0 },
    }), '*');
    frameElements.forEach((ele) => {
      let { left: frameX, top: frameY } = ele.getBoundingClientRect();
      let message = JSON.stringify({
        type: messages.FOLLOW_REQUEST_COUNT_TARGETS,
        viewSize: { width: viewWidth, height: viewHeight },
        framePosition: { x: frameX, y: frameY },
      });
      if (ele instanceof HTMLFrameElement && ele.contentWindow ||
        ele instanceof HTMLIFrameElement && ele.contentWindow) {
        ele.contentWindow.postMessage(message, '*');
      }
    });
  }

  create(count: number, sender: WebMessageSender) {
    let produced = [];
    for (let i = 0; i < count; ++i) {
      produced.push((this.producer as HintKeyProducer).produce());
    }
    this.keys = this.keys.concat(produced);

    (sender as Window).postMessage(JSON.stringify({
      type: messages.FOLLOW_CREATE_HINTS,
      keysArray: produced,
      newTab: this.state.newTab,
      background: this.state.background,
    }), '*');
  }

  remove() {
    this.keys = [];
    broadcastMessage(this.win, {
      type: messages.FOLLOW_REMOVE_HINTS,
    });
  }

  private hintchars() {
    return settingRepository.get().properties.hintchars;
  }
}
