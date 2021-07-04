import ConsoleFramePresenter from "../../../../src/content/presenters/ConsoleFramePresenter";

export default class MockConsoleFramePresenter
  implements ConsoleFramePresenter
{
  constructor(public attached: boolean) {}

  attach(): void {
    this.attached = true;
  }

  detach(): void {
    this.attached = false;
  }

  blur(): void {
    throw new Error("not implemented");
  }

  resize(_width: number, _height: number): void {
    throw new Error("not implemented");
  }

  isTopWindow(): boolean {
    return true;
  }
}
