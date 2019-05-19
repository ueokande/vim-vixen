import * as messages from '../../shared/messages';
import MarkUseCase from '../usecases/MarkUseCase';

export default class MarkController {
  private markUseCase: MarkUseCase;

  constructor({
    markUseCase = new MarkUseCase(),
  } = {}) {
    this.markUseCase = markUseCase;
  }

  scrollTo(message: messages.TabScrollToMessage) {
    this.markUseCase.scroll(message.x, message.y);
  }
}
