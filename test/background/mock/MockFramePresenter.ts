import FramePresenter from "../../../src/background/presenters/FramePresenter";

export default class MockFramePresenter implements FramePresenter {
  getAllFrameIds(): Promise<number[]> {
    throw new Error("not implemented");
  }
}
