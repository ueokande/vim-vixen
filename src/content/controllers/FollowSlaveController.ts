import { injectable } from 'tsyringe';
import * as messages from '../../shared/messages';
import FollowSlaveUseCase from '../usecases/FollowSlaveUseCase';

@injectable()
export default class FollowSlaveController {
  constructor(
    private usecase: FollowSlaveUseCase,
  ) {
  }

  countTargets(m: messages.FollowRequestCountTargetsMessage): void {
    this.usecase.countTargets(m.viewSize, m.framePosition);
  }

  createHints(m: messages.FollowCreateHintsMessage): void {
    this.usecase.createHints(m.viewSize, m.framePosition, m.tags);
  }

  showHints(m: messages.FollowShowHintsMessage): void {
    this.usecase.showHints(m.prefix);
  }

  activate(m: messages.FollowActivateMessage): void {
    this.usecase.activate(m.tag, m.newTab, m.background);
  }

  clear(_m: messages.FollowRemoveHintsMessage) {
    this.usecase.clear();
  }
}
