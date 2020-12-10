import "reflect-metadata";
import { expect } from "chai";
import TabOperatorFactoryChain from "../../../../src/background/operators/impls/TabOperatorFactoryChain";
import MockTabPresenter from "../../mock/MockTabPresenter";
import DuplicateTabOperator from "../../../../src/background/operators/impls/DuplicateTabOperator";
import TogglePinnedTabOperator from "../../../../src/background/operators/impls/TogglePinnedTabOperator";
import UnpinTabOperator from "../../../../src/background/operators/impls/UnpinTabOperator";
import PinTabOperator from "../../../../src/background/operators/impls/PinTabOperator";
import ReloadTabOperator from "../../../../src/background/operators/impls/ReloadTabOperator";
import SelectPreviousSelectedTabOperator from "../../../../src/background/operators/impls/SelectPreviousSelectedTabOperator";
import SelectLastTabOperator from "../../../../src/background/operators/impls/SelectLastTabOperator";
import SelectFirstTabOperator from "../../../../src/background/operators/impls/SelectFirstTabOperator";
import SelectTabNextOperator from "../../../../src/background/operators/impls/SelectTabNextOperator";
import SelectTabPrevOperator from "../../../../src/background/operators/impls/SelectTabPrevOperator";
import ReopenTabOperator from "../../../../src/background/operators/impls/ReopenTabOperator";
import CloseTabOperator from "../../../../src/background/operators/impls/CloseTabOperator";
import CloseTabRightOperator from "../../../../src/background/operators/impls/CloseTabRightOperator";
import * as operations from "../../../../src/shared/operations";

describe("TabOperatorFactoryChain", () => {
  describe("#create", () => {
    it("returns a operator for the operation", async () => {
      const tabPresenter = new MockTabPresenter();
      const sut = new TabOperatorFactoryChain(tabPresenter);

      expect(sut.create({ type: operations.TAB_CLOSE })).to.be.instanceOf(
        CloseTabOperator
      );
      expect(sut.create({ type: operations.TAB_CLOSE_RIGHT })).to.be.instanceOf(
        CloseTabRightOperator
      );
      expect(sut.create({ type: operations.TAB_CLOSE_FORCE })).to.be.instanceOf(
        CloseTabOperator
      );
      expect(sut.create({ type: operations.TAB_REOPEN })).to.be.instanceOf(
        ReopenTabOperator
      );
      expect(sut.create({ type: operations.TAB_PREV })).to.be.instanceOf(
        SelectTabPrevOperator
      );
      expect(sut.create({ type: operations.TAB_NEXT })).to.be.instanceOf(
        SelectTabNextOperator
      );
      expect(sut.create({ type: operations.TAB_FIRST })).to.be.instanceOf(
        SelectFirstTabOperator
      );
      expect(
        sut.create({ type: operations.TAB_LAST, newTab: false })
      ).to.be.instanceOf(SelectLastTabOperator);
      expect(
        sut.create({ type: operations.TAB_PREV_SEL, newTab: false })
      ).to.be.instanceOf(SelectPreviousSelectedTabOperator);
      expect(
        sut.create({ type: operations.TAB_RELOAD, cache: false })
      ).to.be.instanceOf(ReloadTabOperator);
      expect(sut.create({ type: operations.TAB_PIN })).to.be.instanceOf(
        PinTabOperator
      );
      expect(sut.create({ type: operations.TAB_UNPIN })).to.be.instanceOf(
        UnpinTabOperator
      );
      expect(
        sut.create({ type: operations.TAB_TOGGLE_PINNED })
      ).to.be.instanceOf(TogglePinnedTabOperator);
      expect(sut.create({ type: operations.TAB_DUPLICATE })).to.be.instanceOf(
        DuplicateTabOperator
      );
      expect(sut.create({ type: operations.CANCEL })).to.be.null;
    });
  });
});
