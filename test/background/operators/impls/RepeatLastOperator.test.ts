import RepeatLastOperator from "../../../../src/background/operators/impls/RepeatLastOperator";
import MockRepeatRepository from "../../mock/MockRepeatRepository";
import OperatorFactory from "../../../../src/background/operators/OperatorFactory";
import * as operations from "../../../../src/shared/operations";
import Operator from "../../../../src/background/operators/Operator";

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
      const runSpy = jest
        .spyOn(operator, "run")
        .mockReturnValue(Promise.resolve());

      const repeatRepository = new MockRepeatRepository();
      repeatRepository.setLastOperation({ type: operations.CANCEL });

      const operatorFactory = new MockOperatorFactory();
      const createSpy = jest
        .spyOn(operatorFactory, "create")
        .mockReturnValue(operator);

      const sut = new RepeatLastOperator(repeatRepository, operatorFactory);
      await sut.run();

      expect(runSpy).toBeCalledTimes(1);
      expect(createSpy).toBeCalledWith({ type: operations.CANCEL });
    });

    it("does nothing if no last operations", async () => {
      const repeatRepository = new MockRepeatRepository();
      const operatorFactory = new MockOperatorFactory();
      const createSpy = jest.spyOn(operatorFactory, "create");

      const sut = new RepeatLastOperator(repeatRepository, operatorFactory);
      await sut.run();

      expect(createSpy).not.toBeCalled();
    });
  });
});
