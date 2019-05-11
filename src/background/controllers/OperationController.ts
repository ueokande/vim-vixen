import * as operations from '../../shared/operations';
import FindUseCase from '../usecases/FindUseCase';
import ConsoleUseCase from '../usecases/ConsoleUseCase';
import TabUseCase from '../usecases/TabUseCase';
import TabSelectUseCase from '../usecases/TabSelectUseCase';
import ZoomUseCase from '../usecases/ZoomUseCase';

export default class OperationController {
  private findUseCase: FindUseCase;

  private consoleUseCase: ConsoleUseCase;

  private tabUseCase: TabUseCase;

  private tabSelectUseCase: TabSelectUseCase;

  private zoomUseCase: ZoomUseCase;

  constructor() {
    this.findUseCase = new FindUseCase();
    this.consoleUseCase = new ConsoleUseCase();
    this.tabUseCase = new TabUseCase();
    this.tabSelectUseCase = new TabSelectUseCase();
    this.zoomUseCase = new ZoomUseCase();
  }

  // eslint-disable-next-line complexity, max-lines-per-function
  exec(operation: operations.Operation): Promise<any> {
    switch (operation.type) {
    case operations.TAB_CLOSE:
      return this.tabUseCase.close(false);
    case operations.TAB_CLOSE_RIGHT:
      return this.tabUseCase.closeRight();
    case operations.TAB_CLOSE_FORCE:
      return this.tabUseCase.close(true);
    case operations.TAB_REOPEN:
      return this.tabUseCase.reopen();
    case operations.TAB_PREV:
      return this.tabSelectUseCase.selectPrev(1);
    case operations.TAB_NEXT:
      return this.tabSelectUseCase.selectNext(1);
    case operations.TAB_FIRST:
      return this.tabSelectUseCase.selectFirst();
    case operations.TAB_LAST:
      return this.tabSelectUseCase.selectLast();
    case operations.TAB_PREV_SEL:
      return this.tabSelectUseCase.selectPrevSelected();
    case operations.TAB_RELOAD:
      return this.tabUseCase.reload(operation.cache);
    case operations.TAB_PIN:
      return this.tabUseCase.setPinned(true);
    case operations.TAB_UNPIN:
      return this.tabUseCase.setPinned(false);
    case operations.TAB_TOGGLE_PINNED:
      return this.tabUseCase.togglePinned();
    case operations.TAB_DUPLICATE:
      return this.tabUseCase.duplicate();
    case operations.PAGE_SOURCE:
      return this.tabUseCase.openPageSource();
    case operations.PAGE_HOME:
      return this.tabUseCase.openHome(operation.newTab);
    case operations.ZOOM_IN:
      return this.zoomUseCase.zoomIn();
    case operations.ZOOM_OUT:
      return this.zoomUseCase.zoomOut();
    case operations.ZOOM_NEUTRAL:
      return this.zoomUseCase.zoomNutoral();
    case operations.COMMAND_SHOW:
      return this.consoleUseCase.showCommand();
    case operations.COMMAND_SHOW_OPEN:
      return this.consoleUseCase.showOpenCommand(operation.alter);
    case operations.COMMAND_SHOW_TABOPEN:
      return this.consoleUseCase.showTabopenCommand(operation.alter);
    case operations.COMMAND_SHOW_WINOPEN:
      return this.consoleUseCase.showWinopenCommand(operation.alter);
    case operations.COMMAND_SHOW_BUFFER:
      return this.consoleUseCase.showBufferCommand();
    case operations.COMMAND_SHOW_ADDBOOKMARK:
      return this.consoleUseCase.showAddbookmarkCommand(operation.alter);
    case operations.FIND_START:
      return this.findUseCase.findStart();
    case operations.CANCEL:
      return this.consoleUseCase.hideConsole();
    }
    throw new Error('unknown operation: ' + operation.type);
  }
}

