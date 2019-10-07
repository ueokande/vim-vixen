import { injectable, inject } from 'tsyringe';
import * as operations from '../../shared/operations';
import KeymapUseCase from '../usecases/KeymapUseCase';
import AddonEnabledUseCase from '../usecases/AddonEnabledUseCase';
import FindSlaveUseCase from '../usecases/FindSlaveUseCase';
import ScrollUseCase from '../usecases/ScrollUseCase';
import FocusUseCase from '../usecases/FocusUseCase';
import ClipboardUseCase from '../usecases/ClipboardUseCase';
import OperationClient from '../client/OperationClient';
import MarkKeyyUseCase from '../usecases/MarkKeyUseCase';
import FollowMasterClient from '../client/FollowMasterClient';
import Key from '../../shared/settings/Key';

@injectable()
export default class KeymapController {
  constructor(
    private keymapUseCase: KeymapUseCase,
    private addonEnabledUseCase: AddonEnabledUseCase,
    private findSlaveUseCase: FindSlaveUseCase,
    private scrollUseCase: ScrollUseCase,
    private focusUseCase: FocusUseCase,
    private clipbaordUseCase: ClipboardUseCase,
    private markKeyUseCase: MarkKeyyUseCase,

    @inject('OperationClient')
    private backgroundClient: OperationClient,

    @inject('FollowMasterClient')
    private followMasterClient: FollowMasterClient,
  ) {
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
