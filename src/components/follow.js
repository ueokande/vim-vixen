import * as followActions from 'actions/follow';
import messages from 'content/messages';
import Hint from 'content/hint';
import HintKeyProducer from 'content/hint-key-producer';

const DEFAULT_HINT_CHARSET = 'abcdefghijklmnopqrstuvwxyz';

const availableKey = (keyCode) => {
  return (
    KeyboardEvent.DOM_VK_0 <= keyCode && keyCode <= KeyboardEvent.DOM_VK_9 ||
    KeyboardEvent.DOM_VK_A <= keyCode && keyCode <= KeyboardEvent.DOM_VK_Z
  );
};

const isNumericKey = (code) => {
  return KeyboardEvent.DOM_VK_0 <= code && code <= KeyboardEvent.DOM_VK_9;
};

const isAlphabeticKey = (code) => {
  return KeyboardEvent.DOM_VK_A <= code && code <= KeyboardEvent.DOM_VK_Z;
};

const inWindow = (window, element) => {
  let {
    top, left, bottom, right
  } = element.getBoundingClientRect();
  return (
    top >= 0 && left >= 0 &&
    bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

export default class FollowComponent {
  constructor(wrapper, store) {
    this.wrapper = wrapper;
    this.store = store;
    this.hintElements = {};
    this.state = {};

    let doc = wrapper.ownerDocument;
    doc.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  update() {
    let prevState = this.state;
    this.state = this.store.getState().follow;
    if (!prevState.enabled && this.state.enabled) {
      this.create();
    } else if (prevState.enabled && !this.state.enabled) {
      this.remove();
    } else if (JSON.stringify(prevState.keys) !==
      JSON.stringify(this.state.keys)) {
      this.updateHints();
    }
  }

  onKeyDown(e) {
    if (!this.state.enabled) {
      return;
    }

    let { keyCode } = e;
    switch (keyCode) {
    case KeyboardEvent.DOM_VK_ENTER:
    case KeyboardEvent.DOM_VK_RETURN:
      this.activate(this.hintElements[
        FollowComponent.codeChars(this.state.keys)].target);
      return;
    case KeyboardEvent.DOM_VK_ESCAPE:
      this.store.dispatch(followActions.disable());
      return;
    case KeyboardEvent.DOM_VK_BACK_SPACE:
    case KeyboardEvent.DOM_VK_DELETE:
      this.store.dispatch(followActions.backspace());
      break;
    default:
      if (availableKey(keyCode)) {
        this.store.dispatch(followActions.keyPress(keyCode));
      }
      break;
    }

    e.stopPropagation();
    e.preventDefault();
  }

  updateHints() {
    let chars = FollowComponent.codeChars(this.state.keys);
    let shown = Object.keys(this.hintElements).filter((key) => {
      return key.startsWith(chars);
    });
    let hidden = Object.keys(this.hintElements).filter((key) => {
      return !key.startsWith(chars);
    });
    if (shown.length === 0) {
      this.remove();
      return;
    } else if (shown.length === 1) {
      this.activate(this.hintElements[chars].target);
      this.remove();
    }

    shown.forEach((key) => {
      this.hintElements[key].show();
    });
    hidden.forEach((key) => {
      this.hintElements[key].hide();
    });
  }

  activate(element) {
    switch (element.tagName.toLowerCase()) {
    case 'a':
      if (this.state.newTab) {
        // getAttribute() to avoid to resolve absolute path
        let href = element.getAttribute('href');

        // eslint-disable-next-line no-script-url
        if (!href || href === '#' || href.startsWith('javascript:')) {
          return;
        }
        return browser.runtime.sendMessage({
          type: messages.OPEN_URL,
          url: element.href,
          newTab: this.state.newTab,
        });
      }
      if (element.href.startsWith('http://') ||
        element.href.startsWith('https://') ||
        element.href.startsWith('ftp://')) {
        return browser.runtime.sendMessage({
          type: messages.OPEN_URL,
          url: element.href,
          newTab: this.state.newTab,
        });
      }
      return element.click();
    case 'input':
      switch (element.type) {
      case 'file':
      case 'checkbox':
      case 'radio':
      case 'submit':
      case 'reset':
      case 'button':
      case 'image':
      case 'color':
        return element.click();
      default:
        return element.focus();
      }
    case 'textarea':
      return element.focus();
    case 'button':
      return element.click();
    }
  }

  create() {
    let doc = this.wrapper.ownerDocument;
    let elements = FollowComponent.getTargetElements(doc);
    let producer = new HintKeyProducer(DEFAULT_HINT_CHARSET);
    let hintElements = {};
    Array.prototype.forEach.call(elements, (ele) => {
      let keys = producer.produce();
      let hint = new Hint(ele, keys);
      hintElements[keys] = hint;
    });
    this.hintElements = hintElements;
  }

  remove() {
    let hintElements = this.hintElements;
    Object.keys(this.hintElements).forEach((key) => {
      hintElements[key].remove();
    });
  }

  static codeChars(codes) {
    const CHARCODE_ZERO = '0'.charCodeAt(0);
    const CHARCODE_A = 'a'.charCodeAt(0);

    let chars = '';

    for (let code of codes) {
      if (isNumericKey(code)) {
        chars += String.fromCharCode(
          code - KeyboardEvent.DOM_VK_0 + CHARCODE_ZERO);
      } else if (isAlphabeticKey(code)) {
        chars += String.fromCharCode(
          code - KeyboardEvent.DOM_VK_A + CHARCODE_A);
      }
    }
    return chars;
  }

  static getTargetElements(doc) {
    let all = doc.querySelectorAll('a,button,input,textarea');
    let filtered = Array.prototype.filter.call(all, (element) => {
      let style = window.getComputedStyle(element);
      return style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        element.type !== 'hidden' &&
        element.offsetHeight > 0 &&
        inWindow(window, element);
    });
    return filtered;
  }
}
