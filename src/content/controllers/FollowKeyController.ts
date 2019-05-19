import FollowSlaveUseCase from '../usecases/FollowSlaveUseCase';
import Key from '../domains/Key';

export default class FollowKeyController {
  private followSlaveUseCase: FollowSlaveUseCase;

  constructor({
    followSlaveUseCase = new FollowSlaveUseCase(),
  } = {}) {
    this.followSlaveUseCase = followSlaveUseCase;
  }

  press(key: Key): boolean {
    if (!this.followSlaveUseCase.isFollowMode()) {
      return false;
    }

    this.followSlaveUseCase.sendKey(key);
    return true;
  }
}
