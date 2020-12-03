import sinon from "sinon";
import ResetZoomOperator from "../../../../src/background/operators/impls/ResetZoomOperator";
import MockZoomPresenter from "../../mock/MockZoomPresenter";

describe("ResetZoomOperator", () => {
  describe("#run", () => {
    it("resets zoom on the tab", async () => {
      const zoomPresenter = new MockZoomPresenter();
      const mock = sinon.mock(zoomPresenter).expects("resetZoom").once();

      const sut = new ResetZoomOperator(zoomPresenter);
      await sut.run();

      mock.verify();
    });
  });
});
