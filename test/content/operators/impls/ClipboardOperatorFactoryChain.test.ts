import * as operations from "../../../../src/shared/operations";
import { expect } from "chai";
import ClipboardOperatorFactoryChain from "../../../../src/content/operators/impls/ClipboardOperatorFactoryChain";
import YankURLOperator from "../../../../src/content/operators/impls/YankURLOperator";
import PasteOperator from "../../../../src/content/operators/impls/PasteOperator";
import MockClipboardRepository from "../../mock/MockClipboardRepository";
import MockOperationClient from "../../mock/MockOperationClient";
import MockSettingRepository from "../../mock/MockSettingRepository";
import MockConsoleClient from "../../mock/MockConsoleClient";
import MockURLRepository from "../../mock/MockURLRepository";

describe("ClipboardOperatorFactoryChain", () => {
  describe("#create", () => {
    it("returns an operator", () => {
      const sut = new ClipboardOperatorFactoryChain(
        new MockClipboardRepository(),
        new MockConsoleClient(),
        new MockOperationClient(),
        new MockSettingRepository(),
        new MockURLRepository()
      );
      expect(sut.create({ type: operations.URLS_YANK }, 0)).to.be.instanceOf(
        YankURLOperator
      );
      expect(
        sut.create({ type: operations.URLS_PASTE, newTab: false }, 0)
      ).to.be.instanceOf(PasteOperator);
      expect(sut.create({ type: operations.SCROLL_TOP }, 0)).to.be.null;
    });
  });
});
