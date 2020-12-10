import { expect } from "chai";
import ScrollOperatorFactoryChain from "../../../../src/content/operators/impls/ScrollOperatorFactoryChain";
import MockScrollPresenter from "../../mock/MockScrollPresenter";
import MockSettingRepository from "../../mock/MockSettingRepository";
import HorizontalScrollOperator from "../../../../src/content/operators/impls/HorizontalScrollOperator";
import VerticalScrollOperator from "../../../../src/content/operators/impls/VerticalScrollOperator";
import PageScrollOperator from "../../../../src/content/operators/impls/PageScrollOperator";
import ScrollToTopOperator from "../../../../src/content/operators/impls/ScrollToTopOperator";
import ScrollToBottomOperator from "../../../../src/content/operators/impls/ScrollToBottomOperator";
import ScrollToHomeOperator from "../../../../src/content/operators/impls/ScrollToHomeOperator";
import ScrollToEndOperator from "../../../../src/content/operators/impls/ScrollToEndOperator";
import * as operations from "../../../../src/shared/operations";

describe("ScrollOperatorFactoryChain", () => {
  describe("#create", () => {
    it("returns an operator", () => {
      const sut = new ScrollOperatorFactoryChain(
        new MockScrollPresenter(),
        new MockSettingRepository()
      );
      expect(
        sut.create({ type: operations.SCROLL_HORIZONALLY, count: 10 }, 0)
      ).to.be.instanceOf(HorizontalScrollOperator);
      expect(
        sut.create({ type: operations.SCROLL_VERTICALLY, count: 10 }, 0)
      ).to.be.instanceOf(VerticalScrollOperator);
      expect(
        sut.create({ type: operations.SCROLL_PAGES, count: 10 }, 0)
      ).to.be.instanceOf(PageScrollOperator);
      expect(sut.create({ type: operations.SCROLL_TOP }, 0)).to.be.instanceOf(
        ScrollToTopOperator
      );
      expect(
        sut.create({ type: operations.SCROLL_BOTTOM }, 0)
      ).to.be.instanceOf(ScrollToBottomOperator);
      expect(sut.create({ type: operations.SCROLL_HOME }, 0)).to.be.instanceOf(
        ScrollToHomeOperator
      );
      expect(sut.create({ type: operations.SCROLL_END }, 0)).to.be.instanceOf(
        ScrollToEndOperator
      );
      expect(sut.create({ type: operations.PAGE_HOME, newTab: false }, 0)).to.be
        .null;
    });
  });
});
