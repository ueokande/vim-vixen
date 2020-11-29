import Operator from "../Operator";
import ZoomUseCase from "../../usecases/ZoomUseCase";

export default class ResetZoomOperator implements Operator {
  constructor(private readonly zoomUseCase: ZoomUseCase) {}
  run(): Promise<void> {
    return this.zoomUseCase.zoomNutoral();
  }
}
