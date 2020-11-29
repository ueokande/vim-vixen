import Operator from "../Operator";
import ClipboardRepository from "../../repositories/ClipboardRepository";
import ConsoleClient from "../../client/ConsoleClient";
import URLRepository from "./URLRepository";

export default class YankURLOperator implements Operator {
  constructor(
    private readonly repository: ClipboardRepository,
    private readonly consoleClient: ConsoleClient,
    private readonly urlRepository: URLRepository
  ) {}

  async run(): Promise<void> {
    const url = this.urlRepository.getCurrentURL();
    this.repository.write(url);
    await this.consoleClient.info("Yanked " + url);
  }
}
