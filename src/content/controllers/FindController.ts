import * as messages from '../../shared/messages';
import FindUseCase from '../usecases/FindUseCase';

export default class FindController {
  private findUseCase: FindUseCase;

  constructor({
    findUseCase = new FindUseCase(),
  } = {}) {
    this.findUseCase = findUseCase;
  }

  async start(m: messages.ConsoleEnterFindMessage): Promise<void> {
    await this.findUseCase.startFind(m.text);
  }

  async next(_: messages.FindNextMessage): Promise<void> {
    await this.findUseCase.findNext();
  }

  async prev(_: messages.FindPrevMessage): Promise<void> {
    await this.findUseCase.findPrev();
  }
}
