import Operator from "../Operator";
import TabPresenter from "../../presenters/TabPresenter";
import FindRepository from "../../repositories/FindRepository";
import FindClient from "../../clients/FindClient";
import ConsoleClient from "../../infrastructures/ConsoleClient";

export default class FindPrevOperator implements Operator {
  constructor(
    private readonly tabPresenter: TabPresenter,
    private readonly findRepository: FindRepository,
    private readonly findClient: FindClient,
    private readonly consoleClient: ConsoleClient
  ) {}

  async run(): Promise<void> {
    const tab = await this.tabPresenter.getCurrent();
    const tabId = tab?.id;
    if (tabId == null) {
      return;
    }

    const state = await this.findRepository.getLocalState(tabId);
    if (!state) {
      throw new Error("No previous search keywords");
    }
    state.highlightPosition =
      (state.highlightPosition + state.rangeData.length - 1) %
      state.rangeData.length;
    await this.findClient.selectKeyword(
      tabId,
      state.keyword,
      state.rangeData[state.highlightPosition]
    );
    await this.consoleClient.showInfo(
      tabId,
      `${state.highlightPosition + 1} of ${state.rangeData.length} matched: ${
        state.keyword
      }`
    );
    await this.findRepository.setLocalState(tabId, state);
  }
}
