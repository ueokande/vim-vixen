import Operator from "../Operator";
import TabPresenter from "../../presenters/TabPresenter";
import FindRepository from "../../repositories/FindRepository";
import FindClient from "../../clients/FindClient";
import ConsoleClient from "../../infrastructures/ConsoleClient";
import FramePresenter from "../../presenters/FramePresenter";

export default class FindPrevOperator implements Operator {
  constructor(
    _tabPresenter: TabPresenter,
    _findRepository: FindRepository,
    _findClient: FindClient,
    _consoleClient: ConsoleClient,
    _framePresenter: FramePresenter
  ) {}

  async run(): Promise<void> {
    throw new Error("not implemented");
  }
}
