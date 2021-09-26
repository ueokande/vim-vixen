import "reflect-metadata";
import NavigateOperatorFactoryChain from "../../../../src/background/operators/impls/NavigateOperatorFactoryChain";
import MockTabPresenter from "../../mock/MockTabPresenter";
import MockNavigateClient from "../../mock/MockNavigateClient";
import MockBrowserSettingRepository from "../../mock/MockBrowserSettingRepository";
import NavigateHistoryPrevOperator from "../../../../src/background/operators/impls/NavigateHistoryPrevOperator";
import NavigateHistoryNextOperator from "../../../../src/background/operators/impls/NavigateHistoryNextOperator";
import NavigateLinkPrevOperator from "../../../../src/background/operators/impls/NavigateLinkPrevOperator";
import NavigateLinkNextOperator from "../../../../src/background/operators/impls/NavigateLinkNextOperator";
import NavigateParentOperator from "../../../../src/background/operators/impls/NavigateParentOperator";
import NavigateRootOperator from "../../../../src/background/operators/impls/NavigateRootOperator";
import OpenHomeOperator from "../../../../src/background/operators/impls/OpenHomeOperator";
import OpenSourceOperator from "../../../../src/background/operators/impls/OpenSourceOperator";
import * as operations from "../../../../src/shared/operations";

describe("NavigateOperatorFactoryChain", () => {
  describe("#create", () => {
    it("returns a operator for the operation", async () => {
      const tabPresenter = new MockTabPresenter();
      const navigateClient = new MockNavigateClient();
      const browserSettingRepository = new MockBrowserSettingRepository([]);
      const sut = new NavigateOperatorFactoryChain(
        tabPresenter,
        navigateClient,
        browserSettingRepository
      );

      expect(
        sut.create({ type: operations.NAVIGATE_HISTORY_PREV })
      ).toBeInstanceOf(NavigateHistoryPrevOperator);
      expect(
        sut.create({ type: operations.NAVIGATE_HISTORY_NEXT })
      ).toBeInstanceOf(NavigateHistoryNextOperator);
      expect(
        sut.create({ type: operations.NAVIGATE_LINK_PREV })
      ).toBeInstanceOf(NavigateLinkPrevOperator);
      expect(
        sut.create({ type: operations.NAVIGATE_LINK_NEXT })
      ).toBeInstanceOf(NavigateLinkNextOperator);
      expect(sut.create({ type: operations.NAVIGATE_PARENT })).toBeInstanceOf(
        NavigateParentOperator
      );
      expect(sut.create({ type: operations.NAVIGATE_ROOT })).toBeInstanceOf(
        NavigateRootOperator
      );
      expect(sut.create({ type: operations.PAGE_SOURCE })).toBeInstanceOf(
        OpenSourceOperator
      );
      expect(
        sut.create({ type: operations.PAGE_HOME, newTab: false })
      ).toBeInstanceOf(OpenHomeOperator);
      expect(sut.create({ type: operations.CANCEL })).toBeNull;
    });
  });
});
