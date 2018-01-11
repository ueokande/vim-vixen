import * as followControllerActions from 'content/actions/follow-controller';
import messages from 'shared/messages';
import HintKeyProducer from 'content/hint-key-producer';
import * as properties from 'shared/settings/properties';

const broadcastMessage = (win, message) => {
  let json = JSON.stringify(message);
  let frames = [window.self].concat(Array.from(window.frames));
  frames.forEach(frame => frame.postMessage(json, '*'));
};

export default class FollowController {
  constructor(win, store) {
    this.win = win;
    this.store = store;
    this.state = {};
    this.keys = [];
    this.producer = null;

    messages.onMessage(this.onMessage.bind(this));

    store.subscribe(() => {
      this.update();
    });
  }

  onMessage(message, sender) {
    switch (message.type) {
    case messages.FOLLOW_START:
      return this.store.dispatch(
        followControllerActions.enable(message.newTab));
    case messages.FOLLOW_RESPONSE_COUNT_TARGETS:
      return this.create(message.count, sender);
    case messages.FOLLOW_KEY_PRESS:
      return this.keyPress(message.key);
    }
  }

  update() {
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

  updateHints() {
    let shown = this.keys.filter(key => key.startsWith(this.state.keys));
    if (shown.length === 1) {
      this.activate();
      this.store.dispatch(followControllerActions.disable());
    }

    broadcastMessage(this.win, {
      type: messages.FOLLOW_SHOW_HINTS,
      keys: this.state.keys,
    });
  }

  activate() {
    broadcastMessage(this.win, {
      type: messages.FOLLOW_ACTIVATE,
      keys: this.state.keys,
    });
  }

  keyPress(key) {
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
    frameElements.forEach((element) => {
      let { left: frameX, top: frameY } = element.getBoundingClientRect();
      let message = JSON.stringify({
        type: messages.FOLLOW_REQUEST_COUNT_TARGETS,
        viewSize: { width: viewWidth, height: viewHeight },
        framePosition: { x: frameX, y: frameY },
      });
      element.contentWindow.postMessage(message, '*');
    });
  }

  create(count, sender) {
    let produced = [];
    for (let i = 0; i < count; ++i) {
      produced.push(this.producer.produce());
    }
    this.keys = this.keys.concat(produced);

    sender.postMessage(JSON.stringify({
      type: messages.FOLLOW_CREATE_HINTS,
      keysArray: produced,
      newTab: this.state.newTab,
    }), '*');
  }

  remove() {
    this.keys = [];
    broadcastMessage(this.win, {
      type: messages.FOLLOW_REMOVE_HINTS,
    });
  }

  hintchars() {
    return this.store.getState().setting.properties.hintchars ||
      properties.defaults.hintchars;
  }
}
