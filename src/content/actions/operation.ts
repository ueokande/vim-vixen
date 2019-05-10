import * as operations from '../../shared/operations';
import * as actions from './index';
import * as messages from '../../shared/messages';
import * as scrolls from '../scrolls';
import * as navigates from '../navigates';
import * as focuses from '../focuses';
import * as urls from '../urls';
import * as consoleFrames from '../console-frames';
import * as markActions from './mark';

import AddonEnabledUseCase from '../usecases/AddonEnabledUseCase';

let addonEnabledUseCase = new AddonEnabledUseCase();

// eslint-disable-next-line complexity, max-lines-per-function
const exec = async(
  operation: operations.Operation,
  settings: any,
): Promise<actions.Action> => {
  let smoothscroll = settings.properties.smoothscroll;
  switch (operation.type) {
  case operations.ADDON_ENABLE:
    await addonEnabledUseCase.enable();
    return { type: actions.NOOP };
  case operations.ADDON_DISABLE:
    await addonEnabledUseCase.disable();
    return { type: actions.NOOP };
  case operations.ADDON_TOGGLE_ENABLED:
    await addonEnabledUseCase.toggle();
    return { type: actions.NOOP };
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
    scrolls.scrollVertically(operation.count, smoothscroll);
    break;
  case operations.SCROLL_HORIZONALLY:
    scrolls.scrollHorizonally(operation.count, smoothscroll);
    break;
  case operations.SCROLL_PAGES:
    scrolls.scrollPages(operation.count, smoothscroll);
    break;
  case operations.SCROLL_TOP:
    scrolls.scrollToTop(smoothscroll);
    break;
  case operations.SCROLL_BOTTOM:
    scrolls.scrollToBottom(smoothscroll);
    break;
  case operations.SCROLL_HOME:
    scrolls.scrollToHome(smoothscroll);
    break;
  case operations.SCROLL_END:
    scrolls.scrollToEnd(smoothscroll);
    break;
  case operations.FOLLOW_START:
    window.top.postMessage(JSON.stringify({
      type: messages.FOLLOW_START,
      newTab: operation.newTab,
      background: operation.background,
    }), '*');
    break;
  case operations.MARK_SET_PREFIX:
    return markActions.startSet();
  case operations.MARK_JUMP_PREFIX:
    return markActions.startJump();
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
    consoleFrames.postInfo('Yanked ' + window.location.href);
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
  return { type: actions.NOOP };
};

export { exec };
