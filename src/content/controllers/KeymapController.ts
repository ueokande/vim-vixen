import * as operations from '../../shared/operations';
import KeymapUseCase from '../usecases/KeymapUseCase';
import AddonEnabledUseCase from '../usecases/AddonEnabledUseCase';
import FindSlaveUseCase from '../usecases/FindSlaveUseCase';
import ScrollUseCase from '../usecases/ScrollUseCase';
import NavigateUseCase from '../usecases/NavigateUseCase';
import FocusUseCase from '../usecases/FocusUseCase';
import ClipboardUseCase from '../usecases/ClipboardUseCase';
import BackgroundClient from '../client/BackgroundClient';
import MarkKeyyUseCase from '../usecases/MarkKeyUseCase';
import FollowMasterClient, { FollowMasterClientImpl }
  from '../client/FollowMasterClient';
import Key from '../domains/Key';

export default class KeymapController {
  private keymapUseCase: KeymapUseCase;

  private addonEnabledUseCase: AddonEnabledUseCase;

  private findSlaveUseCase: FindSlaveUseCase;

  private scrollUseCase: ScrollUseCase;

  private navigateUseCase: NavigateUseCase;

  private focusUseCase: FocusUseCase;

  private clipbaordUseCase: ClipboardUseCase;

  private backgroundClient: BackgroundClient;

  private markKeyUseCase: MarkKeyyUseCase;

  private followMasterClient: FollowMasterClient;

  constructor({
    keymapUseCase = new KeymapUseCase(),
    addonEnabledUseCase = new AddonEnabledUseCase(),
    findSlaveUseCase = new FindSlaveUseCase(),
    scrollUseCase = new ScrollUseCase(),
    navigateUseCase = new NavigateUseCase(),
    focusUseCase = new FocusUseCase(),
    clipbaordUseCase = new ClipboardUseCase(),
    backgroundClient = new BackgroundClient(),
    markKeyUseCase = new MarkKeyyUseCase(),
    followMasterClient = new FollowMasterClientImpl(window.top),
  } = {}) {
    this.keymapUseCase = keymapUseCase;
    this.addonEnabledUseCase = addonEnabledUseCase;
    this.findSlaveUseCase = findSlaveUseCase;
    this.scrollUseCase = scrollUseCase;
    this.navigateUseCase = navigateUseCase;
    this.focusUseCase = focusUseCase;
    this.clipbaordUseCase = clipbaordUseCase;
    this.backgroundClient = backgroundClient;
    this.markKeyUseCase = markKeyUseCase;
    this.followMasterClient = followMasterClient;
  }

  // eslint-disable-next-line complexity, max-lines-per-function
  press(key: Key): boolean {
    let op = this.keymapUseCase.nextOp(key);
    if (op === null) {
      return false;
    }

    // do not await due to return a boolean immediately
    switch (op.type) {
    case operations.ADDON_ENABLE:
      this.addonEnabledUseCase.enable();
      break;
    case operations.ADDON_DISABLE:
      this.addonEnabledUseCase.disable();
      break;
    case operations.ADDON_TOGGLE_ENABLED:
      this.addonEnabledUseCase.toggle();
      break;
    case operations.FIND_NEXT:
      this.findSlaveUseCase.findNext();
      break;
    case operations.FIND_PREV:
      this.findSlaveUseCase.findPrev();
      break;
    case operations.SCROLL_VERTICALLY:
      this.scrollUseCase.scrollVertically(op.count);
      break;
    case operations.SCROLL_HORIZONALLY:
      this.scrollUseCase.scrollHorizonally(op.count);
      break;
    case operations.SCROLL_PAGES:
      this.scrollUseCase.scrollPages(op.count);
      break;
    case operations.SCROLL_TOP:
      this.scrollUseCase.scrollToTop();
      break;
    case operations.SCROLL_BOTTOM:
      this.scrollUseCase.scrollToBottom();
      break;
    case operations.SCROLL_HOME:
      this.scrollUseCase.scrollToHome();
      break;
    case operations.SCROLL_END:
      this.scrollUseCase.scrollToEnd();
      break;
    case operations.FOLLOW_START:
      this.followMasterClient.startFollow(op.newTab, op.background);
      break;
    case operations.MARK_SET_PREFIX:
      this.markKeyUseCase.enableSetMode();
      break;
    case operations.MARK_JUMP_PREFIX:
      this.markKeyUseCase.enableJumpMode();
      break;
    case operations.NAVIGATE_HISTORY_PREV:
      this.navigateUseCase.openHistoryPrev();
      break;
    case operations.NAVIGATE_HISTORY_NEXT:
      this.navigateUseCase.openHistoryNext();
      break;
    case operations.NAVIGATE_LINK_PREV:
      this.navigateUseCase.openLinkPrev();
      break;
    case operations.NAVIGATE_LINK_NEXT:
      this.navigateUseCase.openLinkNext();
      break;
    case operations.NAVIGATE_PARENT:
      this.navigateUseCase.openParent();
      break;
    case operations.NAVIGATE_ROOT:
      this.navigateUseCase.openRoot();
      break;
    case operations.FOCUS_INPUT:
      this.focusUseCase.focusFirstInput();
      break;
    case operations.URLS_YANK:
      this.clipbaordUseCase.yankCurrentURL();
      break;
    case operations.URLS_PASTE:
      this.clipbaordUseCase.openOrSearch(
        op.newTab ? op.newTab : false,
      );
      break;
    default:
      this.backgroundClient.execBackgroundOp(op);
    }
    return true;
  }
}
