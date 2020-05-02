import FollowSlaveClient, { FollowSlaveClientImpl } from "./FollowSlaveClient";

export default interface FollowSlaveClientFactory {
  create(window: Window): FollowSlaveClient;
}

export class FollowSlaveClientFactoryImpl implements FollowSlaveClientFactory {
  create(window: Window): FollowSlaveClient {
    return new FollowSlaveClientImpl(window);
  }
}
