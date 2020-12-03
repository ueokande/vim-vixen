import sinon from "sinon";
import ZoomInOperator from "../../../../src/background/operators/impls/ZoomInOperator";
import MockZoomPresenter from "../../mock/MockZoomPresenter";

describe("ZoomInOperator", () => {
  describe("#run", () => {
    it("zoom-out the current tab", async () => {
      const zoomPresenter = new MockZoomPresenter();
      const mock = sinon.mock(zoomPresenter).expects("zoomIn").once();

      const sut = new ZoomInOperator(zoomPresenter);
      await sut.run();

      mock.verify();
    });
  });
});
