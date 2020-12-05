import { inject, injectable } from "tsyringe";
import Operator from "../Operator";
import OperatorFactoryChain from "../OperatorFactoryChain";
import ZoomInOperator from "./ZoomInOperator";
import ZoomOutOperator from "./ZoomOutOperator";
import ResetZoomOperator from "./ResetZoomOperator";
import ZoomPresenter from "../../presenters/ZoomPresenter";
import * as operations from "../../../shared/operations";

@injectable()
export default class ZoomOperatorFactoryChain implements OperatorFactoryChain {
  constructor(
    @inject("ZoomPresenter")
    private readonly zoomPresenter: ZoomPresenter
  ) {}

  create(op: operations.Operation): Operator | null {
    switch (op.type) {
      case operations.ZOOM_IN:
        return new ZoomInOperator(this.zoomPresenter);
      case operations.ZOOM_OUT:
        return new ZoomOutOperator(this.zoomPresenter);
      case operations.ZOOM_NEUTRAL:
        return new ResetZoomOperator(this.zoomPresenter);
    }
    return null;
  }
}
