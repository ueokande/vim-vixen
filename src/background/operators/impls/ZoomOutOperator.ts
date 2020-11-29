import Operator from "../Operator";
import ZoomUseCase from "../../usecases/ZoomUseCase";

export default class ZoomOutOperator implements Operator {
  constructor(private readonly zoomUseCase: ZoomUseCase) {}

  run(): Promise<void> {
    return this.zoomUseCase.zoomOut();
  }
}
