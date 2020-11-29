import Operator from "../Operator";
import ClipboardRepository from "../../repositories/ClipboardRepository";
import ConsoleClient from "../../client/ConsoleClient";

export default class YankURLOperator implements Operator {
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
