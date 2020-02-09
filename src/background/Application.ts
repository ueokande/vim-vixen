import { injectable, inject } from 'tsyringe';
import ContentMessageListener from './infrastructures/ContentMessageListener';
import SettingController from './controllers/SettingController';
import VersionController from './controllers/VersionController';
import SettingRepository from "./repositories/SettingRepository";

@injectable()
export default class Application {
  constructor(
    private contentMessageListener: ContentMessageListener,
    private settingController: SettingController,
    private versionController: VersionController,
    @inject("SyncSettingRepository") private syncSettingRepository: SettingRepository,
  ) {
  }

  run() {
    this.settingController.reload();

    browser.runtime.onInstalled.addListener((details) => {
      if (details.reason !== 'install' && details.reason !== 'update') {
        return;
      }
      this.versionController.notify();
    });

    this.contentMessageListener.run();
    this.syncSettingRepository.onChange(() => {
      this.settingController.reload();
    });
  }
}
