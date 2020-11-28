import { inject, injectable } from "tsyringe";
import Operator from "../Operator";
import OperatorFactoryChain from "../OperatorFactoryChain";
import ClipboardRepository from "../../repositories/ClipboardRepository";
import SettingRepository from "../../repositories/SettingRepository";
import ConsoleClient from "../../client/ConsoleClient";
import OperationClient from "../../client/OperationClient";
import * as urls from "../../../shared/urls";
import * as operations from "../../../shared/operations";

export class YankURLOperator implements Operator {
  constructor(
    private readonly repository: ClipboardRepository,
    private readonly consoleClient: ConsoleClient
  ) {}

  async run(): Promise<void> {
    const url = window.location.href;
    this.repository.write(url);
    await this.consoleClient.info("Yanked " + url);
  }
}

export class PasteOperator implements Operator {
  constructor(
    private readonly repository: ClipboardRepository,
    private readonly settingRepository: SettingRepository,
    private readonly operationClient: OperationClient,
    private readonly newTab: boolean
  ) {}

  async run(): Promise<void> {
    const search = this.settingRepository.get().search;
    const text = this.repository.read();
    const url = urls.searchUrl(text, search);

    // NOTE: Repeat pasting from clipboard instead of opening a certain url.
    // 'Repeat last' command is implemented in the background script and cannot
    // access to clipboard until Firefox 63.
    await this.operationClient.internalOpenUrl(url, this.newTab);
  }
}

@injectable()
export class ClipboardOperatorFactoryChain implements OperatorFactoryChain {
  constructor(
    @inject("ClipboardRepository")
    private readonly clipboardRepository: ClipboardRepository,
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient,
    @inject("OperationClient")
    private readonly operationClinet: OperationClient,
    @inject("SettingRepository")
    private readonly settingRepository: SettingRepository
  ) {}

  create(op: operations.Operation, _repeat: number): Operator | null {
    switch (op.type) {
      case operations.URLS_YANK:
        return new YankURLOperator(
          this.clipboardRepository,
          this.consoleClient
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
