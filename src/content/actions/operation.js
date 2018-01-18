import operations from 'shared/operations';
import messages from 'shared/messages';
import * as scrolls from 'content/scrolls';
import * as navigates from 'content/navigates';
import * as focuses from 'content/focuses';
import * as urls from 'content/urls';
import * as consoleFrames from 'content/console-frames';
import * as addonActions from './addon';
import * as properties from 'shared/settings/properties';

// eslint-disable-next-line complexity
const exec = (operation, repeat, settings) => {
  let smoothscroll = settings.properties.smoothscroll ||
    properties.defaults.smoothscroll;
  switch (operation.type) {
  case operations.ADDON_ENABLE:
    return addonActions.enable();
  case operations.ADDON_DISABLE:
    return addonActions.disable();
  case operations.ADDON_TOGGLE_ENABLED:
    return addonActions.toggleEnabled();
  case operations.FIND_NEXT:
    return window.top.postMessage(JSON.stringify({
      type: messages.FIND_NEXT,
    }), '*');
  case operations.FIND_PREV:
    return window.top.postMessage(JSON.stringify({
      type: messages.FIND_PREV,
    }), '*');
  case operations.SCROLL_VERTICALLY:
    return scrolls.scrollVertically(operation.count, smoothscroll, repeat);
  case operations.SCROLL_HORIZONALLY:
    return scrolls.scrollHorizonally(operation.count, smoothscroll, repeat);
  case operations.SCROLL_PAGES:
    return scrolls.scrollPages(operation.count, smoothscroll, repeat);
  case operations.SCROLL_TOP:
    return scrolls.scrollTop(smoothscroll, repeat);
  case operations.SCROLL_BOTTOM:
    return scrolls.scrollBottom(smoothscroll, repeat);
  case operations.SCROLL_HOME:
    return scrolls.scrollHome(smoothscroll, repeat);
  case operations.SCROLL_END:
    return scrolls.scrollEnd(smoothscroll, repeat);
  case operations.FOLLOW_START:
    return window.top.postMessage(JSON.stringify({
      type: messages.FOLLOW_START,
      newTab: operation.newTab
    }), '*');
  case operations.NAVIGATE_HISTORY_PREV:
    return navigates.historyPrev(window);
  case operations.NAVIGATE_HISTORY_NEXT:
    return navigates.historyNext(window);
  case operations.NAVIGATE_LINK_PREV:
    return navigates.linkPrev(window);
  case operations.NAVIGATE_LINK_NEXT:
    return navigates.linkNext(window);
  case operations.NAVIGATE_PARENT:
    return navigates.parent(window);
  case operations.NAVIGATE_ROOT:
    return navigates.root(window);
  case operations.FOCUS_INPUT:
    return focuses.focusInput();
  case operations.URLS_YANK:
    urls.yank(window);
    return consoleFrames.postMessage(window.document, {
      type: messages.CONSOLE_SHOW_INFO,
      text: 'Current url yanked',
    });
  case operations.URLS_PASTE:
    return urls.paste(window, operation.newTab ? operation.newTab : false);
  default:
    browser.runtime.sendMessage({
      type: messages.BACKGROUND_OPERATION,
      operation,
    });
  }
};

export { exec };
