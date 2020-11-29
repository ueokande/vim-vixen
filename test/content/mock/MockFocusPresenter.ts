import FocusPresenter from "../../../src/content/presenters/FocusPresenter";

export default class MockFocusPresenter implements FocusPresenter {
  focusFirstElement(): boolean {
    throw new Error("not implemented");
  }
}
