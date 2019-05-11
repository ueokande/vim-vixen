import * as operations from '../../shared/operations';
import * as actions from './index';
import * as messages from '../../shared/messages';
import * as navigates from '../navigates';
import * as focuses from '../focuses';
import * as markActions from './mark';

import AddonEnabledUseCase from '../usecases/AddonEnabledUseCase';
import ClipboardUseCase from '../usecases/ClipboardUseCase';
import { SettingRepositoryImpl } from '../repositories/SettingRepository';
import { ScrollPresenterImpl } from '../presenters/ScrollPresenter';

let addonEnabledUseCase = new AddonEnabledUseCase();
let clipbaordUseCase = new ClipboardUseCase();
let settingRepository = new SettingRepositoryImpl();
let scrollPresenter = new ScrollPresenterImpl();

// eslint-disable-next-line complexity, max-lines-per-function
const exec = async(
  operation: operations.Operation,
): Promise<actions.Action> => {
  let settings = settingRepository.get();
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
    scrollPresenter.scrollVertically(operation.count, smoothscroll);
    break;
  case operations.SCROLL_HORIZONALLY:
    scrollPresenter.scrollHorizonally(operation.count, smoothscroll);
    break;
  case operations.SCROLL_PAGES:
    scrollPresenter.scrollPages(operation.count, smoothscroll);
    break;
  case operations.SCROLL_TOP:
    scrollPresenter.scrollToTop(smoothscroll);
    break;
  case operations.SCROLL_BOTTOM:
    scrollPresenter.scrollToBottom(smoothscroll);
    break;
  case operations.SCROLL_HOME:
    scrollPresenter.scrollToHome(smoothscroll);
    break;
  case operations.SCROLL_END:
    scrollPresenter.scrollToEnd(smoothscroll);
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
    await clipbaordUseCase.yankCurrentURL();
    break;
  case operations.URLS_PASTE:
    await clipbaordUseCase.openOrSearch(
      operation.newTab ? operation.newTab : false,
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
