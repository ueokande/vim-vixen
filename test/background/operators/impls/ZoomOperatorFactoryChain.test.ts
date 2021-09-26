import "reflect-metadata";
import ZoomOperatorFactoryChain from "../../../../src/background/operators/impls/ZoomOperatorFactoryChain";
import MockZoomPresenter from "../../mock/MockZoomPresenter";
import ZoomInOperator from "../../../../src/background/operators/impls/ZoomInOperator";
import ZoomOutOperator from "../../../../src/background/operators/impls/ZoomOutOperator";
import ResetZoomOperator from "../../../../src/background/operators/impls/ResetZoomOperator";
import * as operations from "../../../../src/shared/operations";

describe("ZoomOperatorFactoryChain", () => {
  describe("#create", () => {
    it("returns a operator for the operation", async () => {
      const zoomPresenter = new MockZoomPresenter();
      const sut = new ZoomOperatorFactoryChain(zoomPresenter);

      expect(sut.create({ type: operations.ZOOM_IN })).toBeInstanceOf(
        ZoomInOperator
      );
      expect(sut.create({ type: operations.ZOOM_OUT })).toBeInstanceOf(
        ZoomOutOperator
      );
      expect(sut.create({ type: operations.ZOOM_NEUTRAL })).toBeInstanceOf(
        ResetZoomOperator
      );
      expect(sut.create({ type: operations.CANCEL })).toBeNull;
    });
  });
});
