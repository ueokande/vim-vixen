import Operator from "../Operator";
import ZoomPresenter from "../../presenters/ZoomPresenter";

export default class ZoomInOperator implements Operator {
  constructor(private readonly zoomPresenter: ZoomPresenter) {}

  run(): Promise<void> {
    return this.zoomPresenter.zoomIn();
  }
}
