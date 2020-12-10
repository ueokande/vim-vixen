import WindowPresenter from "../../../src/background/presenters/WindowPresenter";

export default class MockWindowPresenter implements WindowPresenter {
  create(_url: string): Promise<void> {
    throw new Error("not implemented");
  }
}
