import * as operations from "../../../../src/shared/operations";
import { expect } from "chai";
import FindOperatorFactoryChain from "../../../../src/content/operators/impls/FindOperatorFactoryChain";
import MockFindMasterClient from "../../mock/MockFindMasterClient";
import FindNextOperator from "../../../../src/content/operators/impls/FindNextOperator";
import FindPrevOperator from "../../../../src/content/operators/impls/FindPrevOperator";

describe("FindOperatorFactoryChain", () => {
  describe("#create", () => {
    it("returns an operator", () => {
      const sut = new FindOperatorFactoryChain(new MockFindMasterClient());
      expect(sut.create({ type: operations.FIND_NEXT }, 0)).to.be.instanceOf(
        FindNextOperator
      );
      expect(sut.create({ type: operations.FIND_PREV }, 0)).to.be.instanceOf(
        FindPrevOperator
      );
      expect(sut.create({ type: operations.SCROLL_TOP }, 0)).to.be.null;
    });
  });
});
