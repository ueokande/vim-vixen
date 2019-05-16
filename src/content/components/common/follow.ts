import MessageListener from '../../MessageListener';
import Hint, { LinkHint, InputHint } from '../../presenters/Hint';
import * as dom from '../../../shared/utils/dom';
import * as messages from '../../../shared/messages';
import * as keyUtils from '../../../shared/utils/keys';
import TabsClient, { TabsClientImpl } from '../../client/TabsClient';

let tabsClient: TabsClient = new TabsClientImpl();

const TARGET_SELECTOR = [
  'a', 'button', 'input', 'textarea', 'area',
  '[contenteditable=true]', '[contenteditable=""]', '[tabindex]',
  '[role="button"]', 'summary'
].join(',');

interface Size {
  width: number;
  height: number;
}

interface Point {
  x: number;
  y: number;
}

const inViewport = (
  win: Window,
  element: Element,
  viewSize: Size,
  framePosition: Point,
): boolean => {
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

const isAriaHiddenOrAriaDisabled = (win: Window, element: Element): boolean => {
  if (!element || win.document.documentElement === element) {
    return false;
  }
  for (let attr of ['aria-hidden', 'aria-disabled']) {
    let value = element.getAttribute(attr);
    if (value !== null) {
      let hidden = value.toLowerCase();
      if (hidden === '' || hidden === 'true') {
        return true;
      }
    }
  }
  return isAriaHiddenOrAriaDisabled(win, element.parentElement as Element);
};

export default class Follow {
  private win: Window;

  private newTab: boolean;

  private background: boolean;

  private hints: {[key: string]: Hint };

  private targets: HTMLElement[] = [];

  constructor(win: Window) {
    this.win = win;
    this.newTab = false;
    this.background = false;
    this.hints = {};
    this.targets = [];

    new MessageListener().onWebMessage(this.onMessage.bind(this));
  }

  key(key: keyUtils.Key): boolean {
    if (Object.keys(this.hints).length === 0) {
      return false;
    }
    this.win.parent.postMessage(JSON.stringify({
      type: messages.FOLLOW_KEY_PRESS,
      key: key.key,
      ctrlKey: key.ctrlKey,
    }), '*');
    return true;
  }

  countHints(sender: any, viewSize: Size, framePosition: Point) {
    this.targets = Follow.getTargetElements(this.win, viewSize, framePosition);
    sender.postMessage(JSON.stringify({
      type: messages.FOLLOW_RESPONSE_COUNT_TARGETS,
      count: this.targets.length,
    }), '*');
  }

  createHints(keysArray: string[], newTab: boolean, background: boolean) {
    if (keysArray.length !== this.targets.length) {
      throw new Error('illegal hint count');
    }

    this.newTab = newTab;
    this.background = background;
    this.hints = {};
    for (let i = 0; i < keysArray.length; ++i) {
      let keys = keysArray[i];
      let target = this.targets[i];
      if (target instanceof HTMLAnchorElement ||
        target instanceof HTMLAreaElement) {
        this.hints[keys] = new LinkHint(target, keys);
      } else {
        this.hints[keys] = new InputHint(target, keys);
      }
    }
  }

  showHints(keys: string) {
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

  async activateHints(keys: string): Promise<void> {
    let hint = this.hints[keys];
    if (!hint) {
      return;
    }

    if (hint instanceof LinkHint) {
      let url = hint.getLink();
      // ignore taget='_blank'
      if (!this.newTab && hint.getLinkTarget() !== '_blank') {
        hint.click();
        return;
      }
      // eslint-disable-next-line no-script-url
      if (!url || url === '#' || url.toLowerCase().startsWith('javascript:')) {
        return;
      }
      await tabsClient.openUrl(url, this.newTab, this.background);
    } else if (hint instanceof InputHint) {
      hint.activate();
    }
  }

  onMessage(message: messages.Message, sender: any) {
    switch (message.type) {
    case messages.FOLLOW_REQUEST_COUNT_TARGETS:
      return this.countHints(sender, message.viewSize, message.framePosition);
    case messages.FOLLOW_CREATE_HINTS:
      return this.createHints(
        message.keysArray, message.newTab, message.background);
    case messages.FOLLOW_SHOW_HINTS:
      return this.showHints(message.keys);
    case messages.FOLLOW_ACTIVATE:
      return this.activateHints(message.keys);
    case messages.FOLLOW_REMOVE_HINTS:
      return this.removeHints();
    }
  }

  static getTargetElements(
    win: Window,
    viewSize:
    Size, framePosition: Point,
  ): HTMLElement[] {
    let all = win.document.querySelectorAll(TARGET_SELECTOR);
    let filtered = Array.prototype.filter.call(all, (element: HTMLElement) => {
      let style = win.getComputedStyle(element);

      // AREA's 'display' in Browser style is 'none'
      return (element.tagName === 'AREA' || style.display !== 'none') &&
        style.visibility !== 'hidden' &&
        (element as HTMLInputElement).type !== 'hidden' &&
        element.offsetHeight > 0 &&
        !isAriaHiddenOrAriaDisabled(win, element) &&
        inViewport(win, element, viewSize, framePosition);
    });
    return filtered;
  }
}
