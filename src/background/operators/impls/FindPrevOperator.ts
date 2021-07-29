import Operator from "../Operator";
import TabPresenter from "../../presenters/TabPresenter";
import FindRepository from "../../repositories/FindRepository";
import FindClient from "../../clients/FindClient";
import ConsoleClient from "../../infrastructures/ConsoleClient";
import FramePresenter from "../../presenters/FramePresenter";

export default class FindPrevOperator implements Operator {
  constructor(
    private readonly tabPresenter: TabPresenter,
    private readonly findRepository: FindRepository,
    private readonly findClient: FindClient,
    private readonly consoleClient: ConsoleClient,
    private readonly framePresenter: FramePresenter
  ) {}

  async run(): Promise<void> {
    const tab = await this.tabPresenter.getCurrent();
    const tabId = tab?.id;
    if (tabId == null) {
      return;
    }

    const state = await this.findRepository.getLocalState(tabId);
    if (state) {
      // Start to find the keyword from the current frame which last found on,
      // and concat it to end of frame ids to perform a wrap-search
      //
      //                ,- keyword should be in this frame
      //                |
      // [100, 101, 0, 100]
      //   |
      //   `- continue from frame id 100
      //
      const targetFrameIds = state.frameIds
        .slice(state.framePos)
        .concat(
          state.frameIds.slice(0, state.framePos),
          state.frameIds[state.framePos]
        );

      for (let i = targetFrameIds.length - 1; i >= 0; --i) {
        const found = await this.findClient.findPrev(
          tabId,
          targetFrameIds[i],
          state.keyword
        );
        if (found) {
          this.findRepository.setLocalState(tabId, {
            ...state,
            framePos: (i + state.framePos) % state.frameIds.length, // save current frame position or first
          });
          return;
        }
        this.findClient.clearSelection(tabId, targetFrameIds[i]);
      }

      // The keyword is gone.
      this.consoleClient.showError(
        tabId,
        "Pattern not found: " + state.keyword
      );
      return;
    }

    const keyword = await this.findRepository.getGlobalKeyword();
    if (keyword) {
      const frameIds = await this.framePresenter.getAllFrameIds(tabId);
      for (const frameId of frameIds) {
        await this.findClient.clearSelection(tabId, frameId);
      }

      for (let framePos = frameIds.length - 1; framePos >= 0; --framePos) {
        const found = await this.findClient.findPrev(
          tabId,
          frameIds[framePos],
          keyword
        );
        if (found) {
          await this.findRepository.setLocalState(tabId, {
            frameIds,
            framePos,
            keyword,
          });
          await this.consoleClient.showInfo(tabId, "Pattern found: " + keyword);
          return;
        }
      }
      this.consoleClient.showError(tabId, "Pattern not found: " + keyword);
      return;
    }
    await this.consoleClient.showError(tabId, "No previous search keywords");
  }
}
