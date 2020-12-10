import ZoomPresenter from "../../../src/background/presenters/ZoomPresenter";

export default class MockZoomPresenter implements ZoomPresenter {
  resetZoom(): Promise<void> {
    throw new Error("not implemented");
  }

  zoomIn(): Promise<void> {
    throw new Error("not implemented");
  }

  zoomOut(): Promise<void> {
    throw new Error("not implemented");
  }
}
