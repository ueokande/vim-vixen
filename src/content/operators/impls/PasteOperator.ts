import Operator from "../Operator";
import ClipboardRepository from "../../repositories/ClipboardRepository";
import SettingRepository from "../../repositories/SettingRepository";
import OperationClient from "../../client/OperationClient";
import * as urls from "../../../shared/urls";

export default class PasteOperator implements Operator {
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
