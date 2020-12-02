import Operator from "../Operator";
import ZoomPresenter from "../../usecases/ZoomPresenter";

export default class ZoomInOperator implements Operator {
  constructor(private readonly zoomPresenter: ZoomPresenter) {}

  run(): Promise<void> {
    return this.zoomPresenter.zoomIn();
  }
}
