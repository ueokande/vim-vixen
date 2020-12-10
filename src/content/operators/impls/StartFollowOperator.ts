import Operator from "../Operator";
import FollowMasterClient from "../../client/FollowMasterClient";

export default class StartFollowOperator implements Operator {
  constructor(
    private readonly followMasterClient: FollowMasterClient,
    private readonly newTab: boolean,
    private readonly background: boolean
  ) {}

  async run(): Promise<void> {
    this.followMasterClient.startFollow(this.newTab, this.background);
  }
}
