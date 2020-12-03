import "reflect-metadata";
import { expect } from "chai";
import CommandOperatorFactoryChain from "../../../../src/background/operators/impls/CommandOperatorFactoryChain";
import MockTabPresenter from "../../mock/MockTabPresenter";
import MockConsoleClient from "../../mock/MockConsoleClient";
import * as operations from "../../../../src/shared/operations";
import ShowCommandOperator from "../../../../src/background/operators/impls/ShowCommandOperator";
import ShowTabOpenCommandOperator from "../../../../src/background/operators/impls/ShowTabOpenCommandOperator";
import ShowWinOpenCommandOperator from "../../../../src/background/operators/impls/ShowWinOpenCommandOperator";
import ShowBufferCommandOperator from "../../../../src/background/operators/impls/ShowBufferCommandOperator";
import ShowAddBookmarkOperator from "../../../../src/background/operators/impls/ShowAddBookmarkOperator";
import StartFindOperator from "../../../../src/background/operators/impls/StartFindOperator";

describe("CommandOperatorFactoryChain", () => {
  describe("#create", () => {
    it("returns a operator for the operation", async () => {
      const tabPresenter = new MockTabPresenter();
      const consoleClient = new MockConsoleClient();
      const sut = new CommandOperatorFactoryChain(tabPresenter, consoleClient);

      expect(sut.create({ type: operations.COMMAND_SHOW })).to.be.instanceOf(
        ShowCommandOperator
      );
      expect(
        sut.create({ type: operations.COMMAND_SHOW_TABOPEN, alter: true })
      ).to.be.instanceOf(ShowTabOpenCommandOperator);
      expect(
        sut.create({ type: operations.COMMAND_SHOW_WINOPEN, alter: true })
      ).to.be.instanceOf(ShowWinOpenCommandOperator);
      expect(
        sut.create({ type: operations.COMMAND_SHOW_BUFFER })
      ).to.be.instanceOf(ShowBufferCommandOperator);
      expect(
        sut.create({ type: operations.COMMAND_SHOW_ADDBOOKMARK, alter: true })
      ).to.be.instanceOf(ShowAddBookmarkOperator);
      expect(sut.create({ type: operations.FIND_START })).to.be.instanceOf(
        StartFindOperator
      );
      expect(sut.create({ type: operations.CANCEL })).to.be.null;
    });
  });
});
