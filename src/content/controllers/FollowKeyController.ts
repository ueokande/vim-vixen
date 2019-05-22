import { injectable } from 'tsyringe';
import FollowSlaveUseCase from '../usecases/FollowSlaveUseCase';
import Key from '../domains/Key';

@injectable()
export default class FollowKeyController {
  constructor(
    private followSlaveUseCase: FollowSlaveUseCase,
  ) {
  }

  press(key: Key): boolean {
    if (!this.followSlaveUseCase.isFollowMode()) {
      return false;
    }

    this.followSlaveUseCase.sendKey(key);
    return true;
  }
}
