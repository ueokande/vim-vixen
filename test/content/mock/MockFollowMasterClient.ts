import FollowMasterClient from "../../../src/content/client/FollowMasterClient";
import Key from "../../../src/shared/settings/Key";

export default class MockFollowMasterClient implements FollowMasterClient {
  responseHintCount(_count: number): void {
    throw new Error("not implemented");
  }

  sendKey(_key: Key): void {
    throw new Error("not implemented");
  }

  startFollow(_newTab: boolean, _background: boolean): void {
    throw new Error("not implemented");
  }
}
