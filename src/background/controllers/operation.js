import operations from '../../shared/operations';
import OperationInteractor from '../usecases/operation';

export default class OperationController {
  constructor() {
    this.operationInteractor = new OperationInteractor();
  }

  // eslint-disable-next-line complexity, max-lines-per-function
  exec(operation) {
    switch (operation.type) {
    case operations.TAB_CLOSE:
      return this.operationInteractor.close(false);
    case operations.TAB_CLOSE_FORCE:
      return this.operationInteractor.close(true);
    case operations.TAB_REOPEN:
      return this.operationInteractor.reopen();
    case operations.TAB_PREV:
      return this.operationInteractor.selectPrev(1);
    case operations.TAB_NEXT:
      return this.operationInteractor.selectNext(1);
    case operations.TAB_FIRST:
      return this.operationInteractor.selectFirst();
    case operations.TAB_LAST:
      return this.operationInteractor.selectLast();
    case operations.TAB_PREV_SEL:
      return this.operationInteractor.selectPrevSelected();
    case operations.TAB_RELOAD:
      return this.operationInteractor.reload(operation.cache);
    case operations.TAB_PIN:
      return this.operationInteractor.setPinned(true);
    case operations.TAB_UNPIN:
      return this.operationInteractor.setPinned(false);
    case operations.TAB_TOGGLE_PINNED:
      return this.operationInteractor.togglePinned();
    case operations.TAB_DUPLICATE:
      return this.operationInteractor.duplicate();
    case operations.PAGE_SOURCE:
      return this.operationInteractor.openPageSource();
    case operations.ZOOM_IN:
      return this.operationInteractor.zoomIn();
    case operations.ZOOM_OUT:
      return this.operationInteractor.zoomOut();
    case operations.ZOOM_NEUTRAL:
      return this.operationInteractor.zoomNutoral();
    case operations.COMMAND_SHOW:
      return this.operationInteractor.showCommand();
    case operations.COMMAND_SHOW_OPEN:
      return this.operationInteractor.showOpenCommand(operation.alter);
    case operations.COMMAND_SHOW_TABOPEN:
      return this.operationInteractor.showTabopenCommand(operation.alter);
    case operations.COMMAND_SHOW_WINOPEN:
      return this.operationInteractor.showWinopenCommand(operation.alter);
    case operations.COMMAND_SHOW_BUFFER:
      return this.operationInteractor.showBufferCommand();
    case operations.COMMAND_SHOW_ADDBOOKMARK:
      return this.operationInteractor.showAddbookmarkCommand(operation.alter);
    case operations.FIND_START:
      return this.operationInteractor.findStart();
    case operations.CANCEL:
      return this.operationInteractor.hideConsole();
    }
  }
}

