import { injectable } from 'tsyringe';
import * as messages from '../../shared/messages';
import FindUseCase from '../usecases/FindUseCase';

@injectable()
export default class FindController {
  constructor(
    private findUseCase: FindUseCase,
  ) {
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
