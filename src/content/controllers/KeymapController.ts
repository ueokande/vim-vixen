import { injectable, inject } from "tsyringe";
import * as operations from "../../shared/operations";
import KeymapUseCase from "../usecases/KeymapUseCase";
import AddonEnabledUseCase from "../usecases/AddonEnabledUseCase";
import FindSlaveUseCase from "../usecases/FindSlaveUseCase";
import ScrollUseCase from "../usecases/ScrollUseCase";
import FocusUseCase from "../usecases/FocusUseCase";
import ClipboardUseCase from "../usecases/ClipboardUseCase";
import OperationClient from "../client/OperationClient";
import MarkKeyyUseCase from "../usecases/MarkKeyUseCase";
import FollowMasterClient from "../client/FollowMasterClient";
import Key from "../../shared/settings/Key";

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

    @inject("OperationClient")
    private operationClient: OperationClient,

    @inject("FollowMasterClient")
    private followMasterClient: FollowMasterClient
  ) {}

  // eslint-disable-next-line complexity, max-lines-per-function
  press(key: Key): boolean {
    const nextOp = this.keymapUseCase.nextOps(key);
    if (nextOp === null) {
      return false;
    }

    if (!operations.isNRepeatable(nextOp.op.type)) {
      nextOp.repeat = 1;
    }

    const doFunc = ((op: operations.Operation) => {
      switch (op.type) {
        case operations.ADDON_ENABLE:
          return () => this.addonEnabledUseCase.enable();
        case operations.ADDON_DISABLE:
          return () => this.addonEnabledUseCase.disable();
        case operations.ADDON_TOGGLE_ENABLED:
          return () => this.addonEnabledUseCase.toggle();
        case operations.FIND_NEXT:
          return () => this.findSlaveUseCase.findNext();
        case operations.FIND_PREV:
          return () => this.findSlaveUseCase.findPrev();
        case operations.SCROLL_VERTICALLY:
          return () => this.scrollUseCase.scrollVertically(op.count);
        case operations.SCROLL_HORIZONALLY:
          return () => this.scrollUseCase.scrollHorizonally(op.count);
        case operations.SCROLL_PAGES:
          return () => this.scrollUseCase.scrollPages(op.count);
        case operations.SCROLL_TOP:
          return () => this.scrollUseCase.scrollToTop();
        case operations.SCROLL_BOTTOM:
          return () => this.scrollUseCase.scrollToBottom();
        case operations.SCROLL_HOME:
          return () => this.scrollUseCase.scrollToHome();
        case operations.SCROLL_END:
          return () => this.scrollUseCase.scrollToEnd();
        case operations.FOLLOW_START:
          return () =>
            this.followMasterClient.startFollow(op.newTab, op.background);
        case operations.MARK_SET_PREFIX:
          return () => this.markKeyUseCase.enableSetMode();
        case operations.MARK_JUMP_PREFIX:
          return () => this.markKeyUseCase.enableJumpMode();
        case operations.FOCUS_INPUT:
          return () => this.focusUseCase.focusFirstInput();
        case operations.URLS_YANK:
          return () => this.clipbaordUseCase.yankCurrentURL();
        case operations.URLS_PASTE:
          return () =>
            this.clipbaordUseCase.openOrSearch(op.newTab ? op.newTab : false);
        default:
          return null;
      }
    })(nextOp.op);

    if (doFunc === null) {
      // Do not await asynchronous methods to return a boolean immidiately. The
      // caller requires the synchronous response from the callback to identify
      // to continue of abandon the event propagations.
      this.operationClient.execBackgroundOp(nextOp.repeat, nextOp.op);
    } else {
      for (let i = 0; i < nextOp.repeat; ++i) {
        doFunc();
      }
    }
    return true;
  }

  onBlurWindow() {
    this.keymapUseCase.cancel();
  }
}
