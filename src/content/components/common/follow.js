import messages from 'shared/messages';
import Hint from './hint';
import * as dom from 'shared/utils/dom';
import * as urls from 'content/urls';

const LINK_SELECTOR = ['a', 'area'].join(',');
const TARGET_SELECTOR = [
  LINK_SELECTOR, 'button', 'input', 'textarea',
  '[contenteditable=true]', '[contenteditable=""]', '[tabindex]',
  '[role="button"]'
].join(',');


const inViewport = (win, element, viewSize, framePosition) => {
  let {
    top, left, bottom, right
  } = dom.viewportRect(element);
  let doc = win.document;
  let frameWidth = doc.documentElement.clientWidth;
  let frameHeight = doc.documentElement.clientHeight;

  if (right < 0 || bottom < 0 || top > frameHeight || left > frameWidth) {
    // out of frame
    return false;
  }
  if (right + framePosition.x < 0 || bottom + framePosition.y < 0 ||
      left + framePosition.x > viewSize.width ||
      top + framePosition.y > viewSize.height) {
    // out of viewport
    return false;
  }
  return true;
};

const isAriaHiddenOrAriaDisabled = (win, element) => {
  if (!element || win.document.documentElement === element) {
    return false;
  }
  for (let attr of ['aria-hidden', 'aria-disabled']) {
    if (element.hasAttribute(attr)) {
      let hidden = element.getAttribute(attr).toLowerCase();
      if (hidden === '' || hidden === 'true') {
        return true;
      }
    }
  }
  return isAriaHiddenOrAriaDisabled(win, element.parentNode);
};

export default class Follow {
  constructor(win, store) {
    this.win = win;
    this.store = store;
    this.operation = '';
    this.newTab = false;
    this.format = '';
    this.selector = Follow.TARGET_SELECTOR;
    this.hints = {};
    this.targets = [];

    messages.onMessage(this.onMessage.bind(this));
  }

  static get LINK_SELECTOR() {
    return LINK_SELECTOR;
  }

  static get TARGET_SELECTOR() {
    return TARGET_SELECTOR;
  }

  key(key) {
    if (Object.keys(this.hints).length === 0) {
      return false;
    }
    this.win.parent.postMessage(JSON.stringify({
      type: messages.FOLLOW_KEY_PRESS,
      key: key.key,
    }), '*');
    return true;
  }

  openLink(element) {
    // Browser prevent new tab by link with target='_blank'
    if (!this.newTab && element.getAttribute('target') !== '_blank') {
      element.click();
      return;
    }

    let href = element.getAttribute('href');

    // eslint-disable-next-line no-script-url
    if (!href || href === '#' || href.toLowerCase().startsWith('javascript:')) {
      return;
    }
    return browser.runtime.sendMessage({
      type: messages.OPEN_URL,
      url: element.href,
      newTab: true,
    });
  }

  copyLink(element) {
    let text = this.format.replace('|url|', element.href);
    text = text.replace('|text|', element.textContent);
    urls.yank(this.win, text);
  }

  countHints(sender, viewSize, framePosition) {
    this.targets = Follow.getTargetElements(
      this.win, viewSize, framePosition, this.selector);
    sender.postMessage(JSON.stringify({
      type: messages.FOLLOW_RESPONSE_COUNT_TARGETS,
      count: this.targets.length,
    }), '*');
  }

  createHints(keysArray) {
    if (keysArray.length !== this.targets.length) {
      throw new Error('illegal hint count');
    }

    this.hints = {};
    for (let i = 0; i < keysArray.length; ++i) {
      let keys = keysArray[i];
      let hint = new Hint(this.targets[i], keys);
      this.hints[keys] = hint;
    }
  }

  showHints(keys) {
    Object.keys(this.hints).filter(key => key.startsWith(keys))
      .forEach(key => this.hints[key].show());
    Object.keys(this.hints).filter(key => !key.startsWith(keys))
      .forEach(key => this.hints[key].hide());
  }

  removeHints() {
    Object.keys(this.hints).forEach((key) => {
      this.hints[key].remove();
    });
    this.hints = {};
    this.targets = [];
  }

  activateHints(keys) {
    let hint = this.hints[keys];
    if (!hint) {
      return;
    }
    let element = hint.target;
    switch (element.tagName.toLowerCase()) {
    case 'a':
    case 'area':
      switch (this.operation) {
      case messages.FOLLOW_COPY:
        return this.copyLink(element);
      case messages.FOLLOW_START:
      default:
        return this.openLink(element);
      }
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
    default:
      if (dom.isContentEditable(element)) {
        return element.focus();
      } else if (element.hasAttribute('tabindex')) {
        return element.click();
      }
    }
  }

  onMessage(message, sender) {
    let state = this.store.getState().followController;
    switch (message.type) {
    case messages.FOLLOW_REQUEST_COUNT_TARGETS:
      this.operation = state.operation;
      this.newTab = state.newTab;
      this.format = state.format;
      switch (this.operation) {
      case messages.FOLLOW_COPY:
        this.selector = Follow.LINK_SELECTOR;
        break;
      case messages.FOLLOW_START:
      default:
        this.selector = Follow.TARGET_SELECTOR;
        break;
      }
      return this.countHints(sender, message.viewSize, message.framePosition);
    case messages.FOLLOW_CREATE_HINTS:
      return this.createHints(message.keysArray);
    case messages.FOLLOW_SHOW_HINTS:
      return this.showHints(message.keys);
    case messages.FOLLOW_ACTIVATE:
      return this.activateHints(message.keys);
    case messages.FOLLOW_REMOVE_HINTS:
      return this.removeHints(message.keys);
    }
  }

  static getTargetElements(win, viewSize, framePosition, selector) {
    let all = win.document.querySelectorAll(selector);
    let filtered = Array.prototype.filter.call(all, (element) => {
      let style = win.getComputedStyle(element);

      // AREA's 'display' in Browser style is 'none'
      return (element.tagName === 'AREA' || style.display !== 'none') &&
        style.visibility !== 'hidden' &&
        element.type !== 'hidden' &&
        element.offsetHeight > 0 &&
        !isAriaHiddenOrAriaDisabled(win, element) &&
        inViewport(win, element, viewSize, framePosition);
    });
    return filtered;
  }
}
