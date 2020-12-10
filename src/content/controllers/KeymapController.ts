import { injectable, inject } from "tsyringe";
import KeymapUseCase from "../usecases/KeymapUseCase";
import Key from "../../shared/settings/Key";
import OperatorFactory from "../operators/OperatorFactory";

@injectable()
export default class KeymapController {
  constructor(
    private keymapUseCase: KeymapUseCase,

    @inject("OperatorFactory")
    private readonly operatorFactory: OperatorFactory
  ) {}

  // eslint-disable-next-line complexity, max-lines-per-function
  press(key: Key): boolean {
    const nextOp = this.keymapUseCase.nextOps(key);
    if (nextOp === null) {
      return false;
    }

    // Do not await asynchronous methods to return a boolean immidiately. The
    // caller requires the synchronous response from the callback to identify
    // to continue of abandon the event propagation.
    this.operatorFactory
      .create(nextOp.op, nextOp.repeat)
      .run()
      .catch(console.error);

    return true;
  }

  onBlurWindow() {
    this.keymapUseCase.cancel();
  }
}
