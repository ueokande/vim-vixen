import { injectable } from 'tsyringe';
import * as messages from '../../shared/messages';
import MarkUseCase from '../usecases/MarkUseCase';

@injectable()
export default class MarkController {
  constructor(
    private markUseCase: MarkUseCase,
  ) {
  }

  scrollTo(message: messages.TabScrollToMessage) {
    this.markUseCase.scroll(message.x, message.y);
  }
}
