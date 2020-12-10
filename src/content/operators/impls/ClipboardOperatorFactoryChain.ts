import { inject, injectable } from "tsyringe";
import YankURLOperator from "./YankURLOperator";
import PasteOperator from "./PasteOperator";
import Operator from "../Operator";
import OperatorFactoryChain from "../OperatorFactoryChain";
import ClipboardRepository from "../../repositories/ClipboardRepository";
import ConsoleClient from "../../client/ConsoleClient";
import OperationClient from "../../client/OperationClient";
import SettingRepository from "../../repositories/SettingRepository";
import * as operations from "../../../shared/operations";
import URLRepository from "./URLRepository";

@injectable()
export default class ClipboardOperatorFactoryChain
  implements OperatorFactoryChain {
  constructor(
    @inject("ClipboardRepository")
    private readonly clipboardRepository: ClipboardRepository,
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient,
    @inject("OperationClient")
    private readonly operationClinet: OperationClient,
    @inject("SettingRepository")
    private readonly settingRepository: SettingRepository,
    @inject("URLRepository")
    private readonly urlRepository: URLRepository
  ) {}

  create(op: operations.Operation, _repeat: number): Operator | null {
    switch (op.type) {
      case operations.URLS_YANK:
        return new YankURLOperator(
          this.clipboardRepository,
          this.consoleClient,
          this.urlRepository
        );
      case operations.URLS_PASTE:
        return new PasteOperator(
          this.clipboardRepository,
          this.settingRepository,
          this.operationClinet,
          op.newTab
        );
    }
    return null;
  }
}
