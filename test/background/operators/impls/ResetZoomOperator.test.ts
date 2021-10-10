import ResetZoomOperator from "../../../../src/background/operators/impls/ResetZoomOperator";
import MockZoomPresenter from "../../mock/MockZoomPresenter";

describe("ResetZoomOperator", () => {
  describe("#run", () => {
    it("resets zoom on the tab", async () => {
      const zoomPresenter = new MockZoomPresenter();
      const resetZoomSpy = jest
        .spyOn(zoomPresenter, "resetZoom")
        .mockReturnValue(Promise.resolve());

      const sut = new ResetZoomOperator(zoomPresenter);
      await sut.run();

      expect(resetZoomSpy).toBeCalled();
    });
  });
});
