import * as operations from "../../../../src/shared/operations";
import BackgroundOperationOperator from "../../../../src/content/operators/impls/BackgroundOperationOperator";
import OperationClient from "../../../../src/content/client/OperationClient";

class MockOperationClient implements OperationClient {
  public readonly executedOps: {
    op: operations.Operation;
    repeat: number;
  }[] = [];
  async execBackgroundOp(
    repeat: number,
    op: operations.Operation
  ): Promise<void> {
    this.executedOps.push({ repeat, op });
  }

  internalOpenUrl(): Promise<void> {
    throw new Error("not implemented");
  }
}

describe("BackgroundOperationOperator", () => {
  describe("#run", () => {
    it("returns an operator", async () => {
      const client = new MockOperationClient();
      const sut = new BackgroundOperationOperator(client, 2, {
        type: operations.TAB_CLOSE,
      });

      await sut.run();

      expect(client.executedOps).toEqual([
        { op: { type: operations.TAB_CLOSE }, repeat: 2 },
      ]);
    });
  });
});
