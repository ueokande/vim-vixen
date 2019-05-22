import FollowSlaveClient, { FollowSlaveClientImpl } from './FollowSlaveClient';

export default interface FollowSlaveClientFactory {
  create(window: Window): FollowSlaveClient;

  // eslint-disable-next-line semi
}

export class FollowSlaveClientFactoryImpl implements FollowSlaveClientFactory {
  create(window: Window): FollowSlaveClient {
    return new FollowSlaveClientImpl(window);
  }
}
