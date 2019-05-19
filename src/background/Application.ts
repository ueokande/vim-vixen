import { injectable } from 'tsyringe';
import ContentMessageListener from './infrastructures/ContentMessageListener';
import SettingController from './controllers/SettingController';
import VersionController from './controllers/VersionController';

@injectable()
export default class Application {
  constructor(
    private contentMessageListener: ContentMessageListener,
    private settingController: SettingController,
    private versionController: VersionController,
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
    browser.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local') {
        return;
      }
      if (changes.settings) {
        this.settingController.reload();
      }
    });
  }
}
