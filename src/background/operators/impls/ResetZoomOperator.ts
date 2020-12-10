import Operator from "../Operator";
import ZoomPresenter from "../../presenters/ZoomPresenter";

export default class ResetZoomOperator implements Operator {
  constructor(private readonly zoomPresenter: ZoomPresenter) {}

  run(): Promise<void> {
    return this.zoomPresenter.resetZoom();
  }
}
