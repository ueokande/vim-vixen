import * as operations from "../../../../src/shared/operations";
import FocusOperatorFactoryChain from "../../../../src/content/operators/impls/FocusOperatorFactoryChain";
import FocusOperator from "../../../../src/content/operators/impls/FocusOperator";
import MockFocusPresenter from "../../mock/MockFocusPresenter";

describe("FocusOperatorFactoryChain", () => {
  describe("#create", () => {
    it("returns an operator", () => {
      const sut = new FocusOperatorFactoryChain(new MockFocusPresenter());
      expect(sut.create({ type: operations.FOCUS_INPUT }, 0)).toBeInstanceOf(
        FocusOperator
      );
      expect(sut.create({ type: operations.SCROLL_TOP }, 0)).toBeNull;
    });
  });
});
