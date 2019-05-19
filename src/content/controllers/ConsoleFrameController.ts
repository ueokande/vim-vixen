import ConsoleFrameUseCase from '../usecases/ConsoleFrameUseCase';
import * as messages from '../../shared/messages';

export default class ConsoleFrameController {
  private consoleFrameUseCase: ConsoleFrameUseCase;

  constructor({
    consoleFrameUseCase = new ConsoleFrameUseCase(),
  } = {}) {
    this.consoleFrameUseCase = consoleFrameUseCase;
  }

  unfocus(_message: messages.Message) {
    this.consoleFrameUseCase.unfocus();
  }
}
