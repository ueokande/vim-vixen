import "reflect-metadata";
import RepeatOperatorFactoryChain from "../../../../src/background/operators/impls/RepeatOperatorFactoryChain";
import RepeatLastOperator from "../../../../src/background/operators/impls/RepeatLastOperator";
import OperatorFactory from "../../../../src/background/operators/OperatorFactory";
import MockRepeatRepository from "../../mock/MockRepeatRepository";
import Operator from "../../../../src/content/operators/Operator";
import * as operations from "../../../../src/shared/operations";

class MockOperatorFactory implements OperatorFactory {
  create(_op: operations.Operation): Operator {
    throw new Error("not implemented");
  }
}

describe("RepeatOperatorFactoryChain", () => {
  describe("#create", () => {
    it("returns a operator for the operation", async () => {
      const repeatRepository = new MockRepeatRepository();
      const operatorFactory = new MockOperatorFactory();
      const sut = new RepeatOperatorFactoryChain(
        repeatRepository,
        operatorFactory
      );

      expect(sut.create({ type: operations.REPEAT_LAST })).toBeInstanceOf(
        RepeatLastOperator
      );
      expect(sut.create({ type: operations.CANCEL })).toBeNull;
    });
  });
});
