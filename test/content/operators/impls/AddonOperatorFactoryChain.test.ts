import AddonOperatorFactoryChain from "../../../../src/content/operators/impls/AddonOperatorFactoryChain";
import EnableAddonOperator from "../../../../src/content/operators/impls/EnableAddonOperator";
import DisableAddonOperator from "../../../../src/content/operators/impls/DisableAddonOperator";
import ToggleAddonOperator from "../../../../src/content/operators/impls/ToggleAddonOperator";
import * as operations from "../../../../src/shared/operations";
import { expect } from "chai";
import MockAddonIndicatorClient from "../../mock/MockAddonIndicatorClient";
import MockAddonEnabledRepository from "../../mock/MockAddonEnabledRepository";

describe("AddonOperatorFactoryChain", () => {
  describe("#create", () => {
    it("returns an operator", () => {
      const sut = new AddonOperatorFactoryChain(
        new MockAddonIndicatorClient(),
        new MockAddonEnabledRepository()
      );
      expect(sut.create({ type: operations.ADDON_ENABLE }, 0)).to.be.instanceOf(
        EnableAddonOperator
      );
      expect(
        sut.create({ type: operations.ADDON_DISABLE }, 0)
      ).to.be.instanceOf(DisableAddonOperator);
      expect(
        sut.create({ type: operations.ADDON_TOGGLE_ENABLED }, 0)
      ).to.be.instanceOf(ToggleAddonOperator);
      expect(sut.create({ type: operations.SCROLL_TOP }, 0)).to.be.null;
    });
  });
});
