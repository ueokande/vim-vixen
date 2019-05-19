import FollowMasterUseCase from '../usecases/FollowMasterUseCase';
import * as messages from '../../shared/messages';

export default class FollowMasterController {
  private followMasterUseCase: FollowMasterUseCase;

  constructor({
    followMasterUseCase = new FollowMasterUseCase(),
  } = {}) {
    this.followMasterUseCase = followMasterUseCase;
  }

  followStart(m: messages.FollowStartMessage): void {
    this.followMasterUseCase.startFollow(m.newTab, m.background);
  }

  responseCountTargets(
    m: messages.FollowResponseCountTargetsMessage, sender: Window,
  ): void {
    this.followMasterUseCase.createSlaveHints(m.count, sender);
  }

  keyPress(message: messages.FollowKeyPressMessage): void {
    if (message.key === '[' && message.ctrlKey) {
      this.followMasterUseCase.cancelFollow();
    } else {
      this.followMasterUseCase.enqueue(message.key);
    }
  }
}

