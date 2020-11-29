import sinon from "sinon";
import FocusOperator from "../../../../src/content/operators/impls/FocusOperator";
import MockFocusPresenter from "../../mock/MockFocusPresenter";

describe("FocusOperator", () => {
  describe("#run", () => {
    it("focus a first input", async () => {
      const presenter = new MockFocusPresenter();
      const mock = sinon.mock(presenter).expects("focusFirstElement");
      const sut = new FocusOperator(presenter);

      await sut.run();

      mock.verify();
    });
  });
});
