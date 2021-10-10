import ZoomInOperator from "../../../../src/background/operators/impls/ZoomInOperator";
import MockZoomPresenter from "../../mock/MockZoomPresenter";

describe("ZoomInOperator", () => {
  describe("#run", () => {
    it("zoom-out the current tab", async () => {
      const zoomPresenter = new MockZoomPresenter();
      const zoomInSpy = jest
        .spyOn(zoomPresenter, "zoomIn")
        .mockReturnValue(Promise.resolve());

      const sut = new ZoomInOperator(zoomPresenter);
      await sut.run();

      expect(zoomInSpy).toBeCalled();
    });
  });
});
