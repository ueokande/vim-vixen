import Operator from "../Operator";
import ZoomPresenter from "../../usecases/ZoomPresenter";

export default class ZoomOutOperator implements Operator {
  constructor(private readonly zoomPresenter: ZoomPresenter) {}

  run(): Promise<void> {
    return this.zoomPresenter.zoomOut();
  }
}
