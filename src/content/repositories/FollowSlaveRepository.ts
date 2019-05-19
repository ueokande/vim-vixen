export default interface FollowSlaveRepository {
  enableFollowMode(): void;

  disableFollowMode(): void;

  isFollowMode(): boolean;

  // eslint-disable-next-line semi
}

const current: {
  enabled: boolean;
} = {
  enabled: false,
};

export class FollowSlaveRepositoryImpl implements FollowSlaveRepository {
  enableFollowMode(): void {
    current.enabled = true;
  }

  disableFollowMode(): void {
    current.enabled = false;
  }

  isFollowMode(): boolean {
    return current.enabled;
  }
}


