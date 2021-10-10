import FocusOperator from "../../../../src/content/operators/impls/FocusOperator";
import MockFocusPresenter from "../../mock/MockFocusPresenter";

describe("FocusOperator", () => {
  describe("#run", () => {
    it("focus a first input", async () => {
      const presenter = new MockFocusPresenter();
      const focusFirstElementSpy = jest
        .spyOn(presenter, "focusFirstElement")
        .mockReturnValue(true);
      const sut = new FocusOperator(presenter);

      await sut.run();

      expect(focusFirstElementSpy).toBeCalled();
    });
  });
});
