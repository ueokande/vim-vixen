import * as operations from "../../../../src/shared/operations";
import { expect } from "chai";
import MarkOperatorFactoryChain from "../../../../src/content/operators/impls/MarkOperatorFactoryChain";
import MockMarkKeyRepository from "../../mock/MockMarkKeyRepository";
import EnableSetMarkOperator from "../../../../src/content/operators/impls/EnableSetMarkOperator";
import EnableJumpMarkOperator from "../../../../src/content/operators/impls/EnableJumpMarkOperator";

describe("MarkOperatorFactoryChain", () => {
  describe("#create", () => {
    it("returns an operator", () => {
      const sut = new MarkOperatorFactoryChain(new MockMarkKeyRepository());
      expect(
        sut.create({ type: operations.MARK_SET_PREFIX }, 0)
      ).to.be.instanceOf(EnableSetMarkOperator);
      expect(
        sut.create({ type: operations.MARK_JUMP_PREFIX }, 0)
      ).to.be.instanceOf(EnableJumpMarkOperator);
      expect(sut.create({ type: operations.SCROLL_TOP }, 0)).to.be.null;
    });
  });
});
