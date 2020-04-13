import { injectable, inject } from "tsyringe";
import ScrollPresenter from "../presenters/ScrollPresenter";
import MarkClient from "../client/MarkClient";
import MarkRepository from "../repositories/MarkRepository";
import SettingRepository from "../repositories/SettingRepository";
import ConsoleClient from "../client/ConsoleClient";

@injectable()
export default class MarkUseCase {
  constructor(
    @inject("ScrollPresenter") private scrollPresenter: ScrollPresenter,
    @inject("MarkClient") private client: MarkClient,
    @inject("MarkRepository") private repository: MarkRepository,
    @inject("SettingRepository") private settingRepository: SettingRepository,
    @inject("ConsoleClient") private consoleClient: ConsoleClient
  ) {}

  async set(key: string): Promise<void> {
    const pos = this.scrollPresenter.getScroll();
    if (this.globalKey(key)) {
      this.client.setGloablMark(key, pos);
      await this.consoleClient.info(`Set global mark to '${key}'`);
    } else {
      this.repository.set(key, pos);
      await this.consoleClient.info(`Set local mark to '${key}'`);
    }
  }

  async jump(key: string): Promise<void> {
    if (this.globalKey(key)) {
      await this.client.jumpGlobalMark(key);
    } else {
      const pos = this.repository.get(key);
      if (!pos) {
        throw new Error("Mark is not set");
      }
      this.scroll(pos.x, pos.y);
    }
  }

  scroll(x: number, y: number): void {
    const smooth = this.settingRepository.get().properties.smoothscroll;
    this.scrollPresenter.scrollTo(x, y, smooth);
  }

  private globalKey(key: string) {
    return /^[A-Z0-9]$/.test(key);
  }
}
