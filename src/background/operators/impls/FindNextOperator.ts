import Operator from "../Operator";
import TabPresenter from "../../presenters/TabPresenter";
import FindRepository from "../../repositories/FindRepository";
import FindClient from "../../clients/FindClient";

export default class FindNextOperator implements Operator {
  constructor(
    private readonly tabPresenter: TabPresenter,
    private readonly findRepository: FindRepository,
    private readonly findClient: FindClient
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
      (state.highlightPosition + 1) % state.rangeData.length;
    await this.findClient.selectKeyword(
      tabId,
      state.rangeData[state.highlightPosition]
    );
    await this.findRepository.setLocalState(tabId, state);
  }
}
