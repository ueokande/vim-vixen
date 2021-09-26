import "reflect-metadata";
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

      expect(sut.create({ type: operations.COMMAND_SHOW })).toBeInstanceOf(
        ShowCommandOperator
      );
      expect(
        sut.create({ type: operations.COMMAND_SHOW_TABOPEN, alter: true })
      ).toBeInstanceOf(ShowTabOpenCommandOperator);
      expect(
        sut.create({ type: operations.COMMAND_SHOW_WINOPEN, alter: true })
      ).toBeInstanceOf(ShowWinOpenCommandOperator);
      expect(
        sut.create({ type: operations.COMMAND_SHOW_BUFFER })
      ).toBeInstanceOf(ShowBufferCommandOperator);
      expect(
        sut.create({ type: operations.COMMAND_SHOW_ADDBOOKMARK, alter: true })
      ).toBeInstanceOf(ShowAddBookmarkOperator);
      expect(sut.create({ type: operations.FIND_START })).toBeInstanceOf(
        StartFindOperator
      );
      expect(sut.create({ type: operations.CANCEL })).toBeNull;
    });
  });
});
