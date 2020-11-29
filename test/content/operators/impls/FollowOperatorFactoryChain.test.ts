import * as operations from "../../../../src/shared/operations";
import { expect } from "chai";
import FocusOperatorFactoryChain from "../../../../src/content/operators/impls/FocusOperatorFactoryChain";
import FocusOperator from "../../../../src/content/operators/impls/FocusOperator";
import MockFocusPresenter from "../../mock/MockFocusPresenter";

describe("FocusOperatorFactoryChain", () => {
  describe("#create", () => {
    it("returns an operator", () => {
      const sut = new FocusOperatorFactoryChain(new MockFocusPresenter());
      expect(
        sut.create(
          { type: operations.FOCUS_INPUT, newTab: false, background: false },
          0
        )
      ).to.be.instanceOf(FocusOperator);
      expect(sut.create({ type: operations.SCROLL_TOP }, 0)).to.be.null;
    });
  });
});
