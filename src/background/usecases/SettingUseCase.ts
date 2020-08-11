import { inject, injectable } from "tsyringe";
import CachedSettingRepository from "../repositories/CachedSettingRepository";
import SettingData, { DefaultSettingData } from "../../shared/SettingData";
import Settings from "../../shared/settings/Settings";
import Notifier from "../presenters/Notifier";
import SettingRepository from "../repositories/SettingRepository";

@injectable()
export default class SettingUseCase {
  constructor(
    @inject("LocalSettingRepository")
    private localSettingRepository: SettingRepository,
    @inject("SyncSettingRepository")
    private syncSettingRepository: SettingRepository,
    @inject("CachedSettingRepository")
    private cachedSettingRepository: CachedSettingRepository,
    @inject("Notifier") private notifier: Notifier
  ) {}

  getCached(): Promise<Settings> {
    return this.cachedSettingRepository.get();
  }

  async reload(): Promise<Settings> {
    let data = DefaultSettingData;
    try {
      data = await this.loadSettings();
    } catch (e) {
      this.showUnableToLoad(e);
    }

    let value: Settings;
    try {
      value = data.toSettings();
    } catch (e) {
      this.showUnableToLoad(e);
      value = DefaultSettingData.toSettings();
    }
    await this.cachedSettingRepository.update(value!);
    return value;
  }

  private async loadSettings(): Promise<SettingData> {
    const sync = await this.syncSettingRepository.load();
    if (sync) {
      return sync;
    }
    const local = await this.localSettingRepository.load();
    if (local) {
      return local;
    }
    return DefaultSettingData;
  }

  private showUnableToLoad(e: Error) {
    console.error("unable to load settings", e);
    this.notifier.notifyInvalidSettings(() => {
      browser.runtime.openOptionsPage();
    });
  }
}
