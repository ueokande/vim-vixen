import ContentMessageListener from './infrastructures/content-message-listener';
import SettingController from './controllers/setting';
import VersionController from './controllers/version';

new SettingController().reload();
new VersionController().notifyIfUpdated();

new ContentMessageListener().run();
