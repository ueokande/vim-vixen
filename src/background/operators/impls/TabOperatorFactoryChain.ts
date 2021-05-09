import { inject, injectable } from "tsyringe";
import OperatorFactoryChain from "../OperatorFactoryChain";
import * as operations from "../../../shared/operations";
import Operator from "../Operator";
import TabPresenter from "../../presenters/TabPresenter";
import CloseTabOperator from "./CloseTabOperator";
import CloseTabRightOperator from "./CloseTabRightOperator";
import ReopenTabOperator from "./ReopenTabOperator";
import SelectTabPrevOperator from "./SelectTabPrevOperator";
import SelectTabNextOperator from "./SelectTabNextOperator";
import SelectFirstTabOperator from "./SelectFirstTabOperator";
import SelectLastTabOperator from "./SelectLastTabOperator";
import SelectPreviousSelectedTabOperator from "./SelectPreviousSelectedTabOperator";
import ReloadTabOperator from "./ReloadTabOperator";
import PinTabOperator from "./PinTabOperator";
import UnpinTabOperator from "./UnpinTabOperator";
import TogglePinnedTabOperator from "./TogglePinnedTabOperator";
import DuplicateTabOperator from "./DuplicateTabOperator";
import ToggleReaderOperator from "./ToggleReaderOperator";

@injectable()
export default class TabOperatorFactoryChain implements OperatorFactoryChain {
  constructor(
    @inject("TabPresenter")
    private readonly tabPresenter: TabPresenter
  ) {}

  create(op: operations.Operation): Operator | null {
    switch (op.type) {
      case operations.TAB_CLOSE:
        return new CloseTabOperator(
          this.tabPresenter,
          false,
          op.select === "left"
        );
      case operations.TAB_CLOSE_RIGHT:
        return new CloseTabRightOperator(this.tabPresenter);
      case operations.TAB_CLOSE_FORCE:
        return new CloseTabOperator(this.tabPresenter, true, false);
      case operations.TAB_REOPEN:
        return new ReopenTabOperator(this.tabPresenter);
      case operations.TAB_PREV:
        return new SelectTabPrevOperator(this.tabPresenter);
      case operations.TAB_NEXT:
        return new SelectTabNextOperator(this.tabPresenter);
      case operations.TAB_FIRST:
        return new SelectFirstTabOperator(this.tabPresenter);
      case operations.TAB_LAST:
        return new SelectLastTabOperator(this.tabPresenter);
      case operations.TAB_PREV_SEL:
        return new SelectPreviousSelectedTabOperator(this.tabPresenter);
      case operations.TAB_RELOAD:
        return new ReloadTabOperator(this.tabPresenter, op.cache);
      case operations.TAB_PIN:
        return new PinTabOperator(this.tabPresenter);
      case operations.TAB_UNPIN:
        return new UnpinTabOperator(this.tabPresenter);
      case operations.TAB_TOGGLE_PINNED:
        return new TogglePinnedTabOperator(this.tabPresenter);
      case operations.TAB_DUPLICATE:
        return new DuplicateTabOperator(this.tabPresenter);
      case operations.TAB_TOGGLE_READER:
        return new ToggleReaderOperator(this.tabPresenter);
    }
    return null;
  }
}
