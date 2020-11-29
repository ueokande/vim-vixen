import { injectable } from "tsyringe";
import Operator from "../Operator";
import OperatorFactoryChain from "../OperatorFactoryChain";
import ZoomInOperator from "./ZoomInOperator";
import ZoomOutOperator from "./ZoomOutOperator";
import ResetZoomOperator from "./ResetZoomOperator";
import ZoomUseCase from "../../usecases/ZoomUseCase";
import * as operations from "../../../shared/operations";

@injectable()
export default class ZoomOperatorFactoryChain implements OperatorFactoryChain {
  constructor(private readonly zoomUseCase: ZoomUseCase) {}

  create(op: operations.Operation): Operator | null {
    switch (op.type) {
      case operations.ZOOM_IN:
        return new ZoomInOperator(this.zoomUseCase);
      case operations.ZOOM_OUT:
        return new ZoomOutOperator(this.zoomUseCase);
      case operations.ZOOM_NEUTRAL:
        return new ResetZoomOperator(this.zoomUseCase);
    }
    return null;
  }
}
