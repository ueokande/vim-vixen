import sinon from "sinon";
import ZoomOutOperator from "../../../../src/background/operators/impls/ZoomOutOperator";
import MockZoomPresenter from "../../mock/MockZoomPresenter";

describe("ZoomOutOperator", () => {
  describe("#run", () => {
    it("zoom-in the current tab", async () => {
      const zoomPresenter = new MockZoomPresenter();
      const mock = sinon.mock(zoomPresenter).expects("zoomOut").once();

      const sut = new ZoomOutOperator(zoomPresenter);
      await sut.run();

      mock.verify();
    });
  });
});
