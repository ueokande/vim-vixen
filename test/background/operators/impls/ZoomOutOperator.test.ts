import ZoomOutOperator from "../../../../src/background/operators/impls/ZoomOutOperator";
import MockZoomPresenter from "../../mock/MockZoomPresenter";

describe("ZoomOutOperator", () => {
  describe("#run", () => {
    it("zoom-in the current tab", async () => {
      const zoomPresenter = new MockZoomPresenter();
      const zoomOutSpy = jest
        .spyOn(zoomPresenter, "zoomOut")
        .mockReturnValue(Promise.resolve());

      const sut = new ZoomOutOperator(zoomPresenter);
      await sut.run();

      expect(zoomOutSpy).toBeCalled();
    });
  });
});
