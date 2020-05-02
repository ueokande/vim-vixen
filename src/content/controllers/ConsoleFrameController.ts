import { injectable } from "tsyringe";
import ConsoleFrameUseCase from "../usecases/ConsoleFrameUseCase";
import * as messages from "../../shared/messages";

@injectable()
export default class ConsoleFrameController {
  constructor(private consoleFrameUseCase: ConsoleFrameUseCase) {}

  unfocus(_message: messages.Message) {
    this.consoleFrameUseCase.unfocus();
  }
}
