import { inject, injectable } from "tsyringe";
import FindRepository from "../repositories/FindRepository";
import TabPresenter from "../presenters/TabPresenter";
import ConsoleClient from "../infrastructures/ConsoleClient";

@injectable()
export default class FindUseCase {
  constructor(
    @inject("TabPresenter")
    private readonly tabPresenter: TabPresenter,
    private readonly findRepository: FindRepository,
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient
  ) {}

  getKeyword(): Promise<string> {
    return this.findRepository.getKeyword();
  }

  setKeyword(keyword: string): Promise<any> {
    return this.findRepository.setKeyword(keyword);
  }

  async findStart(): Promise<any> {
    const tab = await this.tabPresenter.getCurrent();
    return this.consoleClient.showFind(tab.id as number);
  }
}
