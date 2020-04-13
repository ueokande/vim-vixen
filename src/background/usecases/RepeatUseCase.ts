import { injectable } from "tsyringe";
import * as operations from "../../shared/operations";
import RepeatRepository from "../repositories/RepeatRepository";

type Operation = operations.Operation;

@injectable()
export default class RepeatUseCase {
  constructor(private repeatRepository: RepeatRepository) {}

  storeLastOperation(op: Operation): void {
    this.repeatRepository.setLastOperation(op);
  }

  getLastOperation(): operations.Operation | undefined {
    return this.repeatRepository.getLastOperation();
  }

  // eslint-disable-next-line complexity
  isRepeatable(op: Operation): boolean {
    switch (op.type) {
      case operations.NAVIGATE_HISTORY_PREV:
      case operations.NAVIGATE_HISTORY_NEXT:
      case operations.NAVIGATE_LINK_PREV:
      case operations.NAVIGATE_LINK_NEXT:
      case operations.NAVIGATE_PARENT:
      case operations.NAVIGATE_ROOT:
      case operations.PAGE_SOURCE:
      case operations.PAGE_HOME:
      case operations.TAB_CLOSE:
      case operations.TAB_CLOSE_FORCE:
      case operations.TAB_CLOSE_RIGHT:
      case operations.TAB_REOPEN:
      case operations.TAB_RELOAD:
      case operations.TAB_PIN:
      case operations.TAB_UNPIN:
      case operations.TAB_TOGGLE_PINNED:
      case operations.TAB_DUPLICATE:
      case operations.ZOOM_IN:
      case operations.ZOOM_OUT:
      case operations.ZOOM_NEUTRAL:
      case operations.INTERNAL_OPEN_URL:
        return true;
    }
    return false;
  }
}
