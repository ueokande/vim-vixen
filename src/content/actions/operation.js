import operations from 'shared/operations';
import messages from 'shared/messages';
import * as scrolls from 'content/scrolls';
import * as navigates from 'content/navigates';
import * as focuses from 'content/focuses';
import * as urls from 'content/urls';
import * as consoleFrames from 'content/console-frames';
import * as addonActions from './addon';
import * as properties from 'shared/settings/properties';

// eslint-disable-next-line complexity, max-lines-per-function
const exec = (operation, repeat, settings, addonEnabled) => {
  let smoothscroll = settings.properties.smoothscroll ||
    properties.defaults.smoothscroll;
  switch (operation.type) {
  case operations.ADDON_ENABLE:
    return addonActions.enable();
  case operations.ADDON_DISABLE:
    return addonActions.disable();
  case operations.ADDON_TOGGLE_ENABLED:
    return addonActions.setEnabled(!addonEnabled);
  case operations.FIND_NEXT:
    window.top.postMessage(JSON.stringify({
      type: messages.FIND_NEXT,
    }), '*');
    break;
  case operations.FIND_PREV:
    window.top.postMessage(JSON.stringify({
      type: messages.FIND_PREV,
    }), '*');
    break;
  case operations.SCROLL_VERTICALLY:
    scrolls.scrollVertically(operation.count, smoothscroll, repeat);
    break;
  case operations.SCROLL_HORIZONALLY:
    scrolls.scrollHorizonally(operation.count, smoothscroll, repeat);
    break;
  case operations.SCROLL_PAGES:
    scrolls.scrollPages(operation.count, smoothscroll, repeat);
    break;
  case operations.SCROLL_TOP:
    scrolls.scrollTop(smoothscroll, repeat);
    break;
  case operations.SCROLL_BOTTOM:
    scrolls.scrollBottom(smoothscroll, repeat);
    break;
  case operations.SCROLL_HOME:
    scrolls.scrollHome(smoothscroll, repeat);
    break;
  case operations.SCROLL_END:
    scrolls.scrollEnd(smoothscroll, repeat);
    break;
  case operations.FOLLOW_START:
    window.top.postMessage(JSON.stringify({
      type: messages.FOLLOW_START,
      newTab: operation.newTab,
      background: operation.background,
    }), '*');
    break;
  case operations.NAVIGATE_HISTORY_PREV:
    navigates.historyPrev(window);
    break;
  case operations.NAVIGATE_HISTORY_NEXT:
    navigates.historyNext(window);
    break;
  case operations.NAVIGATE_LINK_PREV:
    navigates.linkPrev(window);
    break;
  case operations.NAVIGATE_LINK_NEXT:
    navigates.linkNext(window);
    break;
  case operations.NAVIGATE_PARENT:
    navigates.parent(window);
    break;
  case operations.NAVIGATE_ROOT:
    navigates.root(window);
    break;
  case operations.FOCUS_INPUT:
    focuses.focusInput();
    break;
  case operations.URLS_YANK:
    urls.yank(window);
    consoleFrames.postInfo(window.document, 'Current url yanked');
    break;
  case operations.URLS_PASTE:
    urls.paste(
      window, operation.newTab ? operation.newTab : false, settings.search
    );
    break;
  default:
    browser.runtime.sendMessage({
      type: messages.BACKGROUND_OPERATION,
      operation,
    });
  }
  return { type: '' };
};

export { exec };
