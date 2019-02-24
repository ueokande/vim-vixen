import operations from '../../shared/operations';
import OperationUseCase from '../usecases/OperationUseCase';

export default class OperationController {
  constructor() {
    this.operationUseCase = new OperationUseCase();
  }

  // eslint-disable-next-line complexity, max-lines-per-function
  exec(operation) {
    switch (operation.type) {
    case operations.TAB_CLOSE:
      return this.operationUseCase.close(false);
    case operations.TAB_CLOSE_RIGHT:
      return this.operationUseCase.closeRight();
    case operations.TAB_CLOSE_FORCE:
      return this.operationUseCase.close(true);
    case operations.TAB_REOPEN:
      return this.operationUseCase.reopen();
    case operations.TAB_PREV:
      return this.operationUseCase.selectPrev(1);
    case operations.TAB_NEXT:
      return this.operationUseCase.selectNext(1);
    case operations.TAB_FIRST:
      return this.operationUseCase.selectFirst();
    case operations.TAB_LAST:
      return this.operationUseCase.selectLast();
    case operations.TAB_PREV_SEL:
      return this.operationUseCase.selectPrevSelected();
    case operations.TAB_RELOAD:
      return this.operationUseCase.reload(operation.cache);
    case operations.TAB_PIN:
      return this.operationUseCase.setPinned(true);
    case operations.TAB_UNPIN:
      return this.operationUseCase.setPinned(false);
    case operations.TAB_TOGGLE_PINNED:
      return this.operationUseCase.togglePinned();
    case operations.TAB_DUPLICATE:
      return this.operationUseCase.duplicate();
    case operations.PAGE_SOURCE:
      return this.operationUseCase.openPageSource();
    case operations.PAGE_HOME:
      return this.operationUseCase.openHome(operation.newTab);
    case operations.ZOOM_IN:
      return this.operationUseCase.zoomIn();
    case operations.ZOOM_OUT:
      return this.operationUseCase.zoomOut();
    case operations.ZOOM_NEUTRAL:
      return this.operationUseCase.zoomNutoral();
    case operations.COMMAND_SHOW:
      return this.operationUseCase.showCommand();
    case operations.COMMAND_SHOW_OPEN:
      return this.operationUseCase.showOpenCommand(operation.alter);
    case operations.COMMAND_SHOW_TABOPEN:
      return this.operationUseCase.showTabopenCommand(operation.alter);
    case operations.COMMAND_SHOW_WINOPEN:
      return this.operationUseCase.showWinopenCommand(operation.alter);
    case operations.COMMAND_SHOW_BUFFER:
      return this.operationUseCase.showBufferCommand();
    case operations.COMMAND_SHOW_ADDBOOKMARK:
      return this.operationUseCase.showAddbookmarkCommand(operation.alter);
    case operations.FIND_START:
      return this.operationUseCase.findStart();
    case operations.CANCEL:
      return this.operationUseCase.hideConsole();
    }
  }
}

