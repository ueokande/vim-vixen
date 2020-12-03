import "reflect-metadata";
import { expect } from "chai";
import InternalOperatorFactoryChain from "../../../../src/background/operators/impls/InternalOperatorFactoryChain";
import MockWindowPresenter from "../../mock/MockWindowPresenter";
import MockTabPresenter from "../../mock/MockTabPresenter";
import MockConsoleClient from "../../mock/MockConsoleClient";
import CancelOperator from "../../../../src/background/operators/impls/CancelOperator";
import InternalOpenURLOperator from "../../../../src/background/operators/impls/InternalOpenURLOperator";
import * as operations from "../../../../src/shared/operations";

describe("InternalOperatorFactoryChain", () => {
  describe("#create", () => {
    it("returns a operator for the operation", async () => {
      const windowPresenter = new MockWindowPresenter();
      const tabPresenter = new MockTabPresenter();
      const consoleClient = new MockConsoleClient();
      const sut = new InternalOperatorFactoryChain(
        windowPresenter,
        tabPresenter,
        consoleClient
      );

      expect(sut.create({ type: operations.CANCEL })).to.be.instanceOf(
        CancelOperator
      );
      expect(
        sut.create({
          type: operations.INTERNAL_OPEN_URL,
          url: "https://example.com",
          newTab: false,
          newWindow: false,
        })
      ).to.be.instanceOf(InternalOpenURLOperator);
      expect(sut.create({ type: operations.COMMAND_SHOW })).to.be.null;
    });
  });
});
