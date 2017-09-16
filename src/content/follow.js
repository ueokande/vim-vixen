import Hint from './hint';
import HintKeyProducer from './hint-key-producer';

const DEFAULT_HINT_CHARSET = 'abcdefghijklmnopqrstuvwxyz';

export default class Follow {
  constructor(doc) {
    this.doc = doc;
    this.hintElements = {};
    this.keys = [];

    // TODO activate input elements and push button elements
    let links = Follow.getTargetElements(doc);

    this.addHints(links);

    this.boundKeydown = this.handleKeydown.bind(this);
    doc.addEventListener('keydown', this.boundKeydown);
  }

  addHints(elements) {
    let producer = new HintKeyProducer(DEFAULT_HINT_CHARSET);
    Array.prototype.forEach.call(elements, (ele) => {
      let keys = producer.produce();
      let hint = new Hint(ele, keys);

      this.hintElements[keys] = hint;
    });
  }

  handleKeydown(e) {
    let { keyCode } = e;
    if (keyCode === KeyboardEvent.DOM_VK_ESCAPE) {
      this.remove();
      return;
    } else if (keyCode === KeyboardEvent.DOM_VK_ENTER ||
               keyCode === KeyboardEvent.DOM_VK_RETURN) {
      let chars = Follow.codeChars(this.keys);
      this.hintElements[chars].activate();
      return;
    } else if (Follow.availableKey(keyCode)) {
      this.keys.push(keyCode);
    } else if (keyCode === KeyboardEvent.DOM_VK_BACK_SPACE ||
               keyCode === KeyboardEvent.DOM_VK_DELETE) {
      this.keys.pop();
    }

    this.refreshKeys();
  }

  refreshKeys() {
    let chars = Follow.codeChars(this.keys);
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
      this.remove();
      this.hintElements[chars].activate();
    }

    shown.forEach((key) => {
      this.hintElements[key].show();
    });
    hidden.forEach((key) => {
      this.hintElements[key].hide();
    });
  }


  remove() {
    this.doc.removeEventListener('keydown', this.boundKeydown);
    Object.keys(this.hintElements).forEach((key) => {
      this.hintElements[key].remove();
    });
  }

  static availableKey(keyCode) {
    return (
      KeyboardEvent.DOM_VK_0 <= keyCode && keyCode <= KeyboardEvent.DOM_VK_9 ||
      KeyboardEvent.DOM_VK_A <= keyCode && keyCode <= KeyboardEvent.DOM_VK_Z
    );
  }

  static isNumericKey(code) {
    return KeyboardEvent.DOM_VK_0 <= code && code <= KeyboardEvent.DOM_VK_9;
  }

  static isAlphabeticKey(code) {
    return KeyboardEvent.DOM_VK_A <= code && code <= KeyboardEvent.DOM_VK_Z;
  }

  static codeChars(codes) {
    const CHARCODE_ZERO = '0'.charCodeAt(0);
    const CHARCODE_A = 'a'.charCodeAt(0);

    let chars = '';

    for (let code of codes) {
      if (Follow.isNumericKey(code)) {
        chars += String.fromCharCode(
          code - KeyboardEvent.DOM_VK_0 + CHARCODE_ZERO);
      } else if (Follow.isAlphabeticKey(code)) {
        chars += String.fromCharCode(
          code - KeyboardEvent.DOM_VK_A + CHARCODE_A);
      }
    }
    return chars;
  }

  static getTargetElements(doc) {
    let all = doc.querySelectorAll('a');
    let filtered = Array.prototype.filter.call(all, (e) => {
      return Follow.isVisibleElement(e);
    });
    return filtered;
  }

  static isVisibleElement(element) {
    let style = window.getComputedStyle(element);
    if (style.display === 'none') {
      return false;
    } else if (style.visibility === 'hidden') {
      return false;
    }
    return true;
  }
}
