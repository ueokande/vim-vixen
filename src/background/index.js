import ContentMessageListener from './infrastructures/ContentMessageListener';
import SettingController from './controllers/SettingController';
import VersionController from './controllers/VersionController';

new SettingController().reload();

browser.runtime.onInstalled.addListener((details) => {
  if (details.reason !== 'install' && details.reason !== 'update') {
    return;
  }
  new VersionController().notify();
});

new ContentMessageListener().run();
