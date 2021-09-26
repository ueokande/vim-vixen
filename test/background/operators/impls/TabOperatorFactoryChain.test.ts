import "reflect-metadata";
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

      expect(sut.create({ type: operations.TAB_CLOSE })).toBeInstanceOf(
        CloseTabOperator
      );
      expect(sut.create({ type: operations.TAB_CLOSE_RIGHT })).toBeInstanceOf(
        CloseTabRightOperator
      );
      expect(sut.create({ type: operations.TAB_CLOSE_FORCE })).toBeInstanceOf(
        CloseTabOperator
      );
      expect(sut.create({ type: operations.TAB_REOPEN })).toBeInstanceOf(
        ReopenTabOperator
      );
      expect(sut.create({ type: operations.TAB_PREV })).toBeInstanceOf(
        SelectTabPrevOperator
      );
      expect(sut.create({ type: operations.TAB_NEXT })).toBeInstanceOf(
        SelectTabNextOperator
      );
      expect(sut.create({ type: operations.TAB_FIRST })).toBeInstanceOf(
        SelectFirstTabOperator
      );
      expect(sut.create({ type: operations.TAB_LAST })).toBeInstanceOf(
        SelectLastTabOperator
      );
      expect(sut.create({ type: operations.TAB_PREV_SEL })).toBeInstanceOf(
        SelectPreviousSelectedTabOperator
      );
      expect(
        sut.create({ type: operations.TAB_RELOAD, cache: false })
      ).toBeInstanceOf(ReloadTabOperator);
      expect(sut.create({ type: operations.TAB_PIN })).toBeInstanceOf(
        PinTabOperator
      );
      expect(sut.create({ type: operations.TAB_UNPIN })).toBeInstanceOf(
        UnpinTabOperator
      );
      expect(sut.create({ type: operations.TAB_TOGGLE_PINNED })).toBeInstanceOf(
        TogglePinnedTabOperator
      );
      expect(sut.create({ type: operations.TAB_DUPLICATE })).toBeInstanceOf(
        DuplicateTabOperator
      );
      expect(sut.create({ type: operations.CANCEL })).toBeNull;
    });
  });
});
