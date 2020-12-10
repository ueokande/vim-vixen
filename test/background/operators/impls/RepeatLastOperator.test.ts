import RepeatLastOperator from "../../../../src/background/operators/impls/RepeatLastOperator";
import MockRepeatRepository from "../../mock/MockRepeatRepository";
import OperatorFactory from "../../../../src/background/operators/OperatorFactory";
import * as operations from "../../../../src/shared/operations";
import Operator from "../../../../src/background/operators/Operator";
import sinon from "sinon";

class MockOperatorFactory implements OperatorFactory {
  create(_op: operations.Operation): Operator {
    throw new Error("not implemented");
  }
}

class MockOperator implements Operator {
  run(): Promise<void> {
    throw new Error("not implemented");
  }
}

describe("RepeatLastOperator", () => {
  describe("#run", () => {
    it("repeat last operation", async () => {
      const operator = new MockOperator();
      const operatorMock = sinon.mock(operator).expects("run").once();
      const repeatRepository = new MockRepeatRepository();
      repeatRepository.setLastOperation({ type: operations.CANCEL });

      const operatorFactory = new MockOperatorFactory();
      const operatorFactoryMock = sinon
        .mock(operatorFactory)
        .expects("create")
        .withArgs({ type: operations.CANCEL });
      operatorFactoryMock.returns(operator);

      const sut = new RepeatLastOperator(repeatRepository, operatorFactory);
      await sut.run();

      operatorFactoryMock.verify();
      operatorMock.verify();
    });

    it("does nothing if no last operations", async () => {
      const repeatRepository = new MockRepeatRepository();
      const operatorFactory = new MockOperatorFactory();
      const operatorFactoryMock = sinon
        .mock(operatorFactory)
        .expects("create")
        .never();

      const sut = new RepeatLastOperator(repeatRepository, operatorFactory);
      await sut.run();

      operatorFactoryMock.verify();
    });
  });
});
