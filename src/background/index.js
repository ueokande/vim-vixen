import ContentMessageListener from './infrastructures/ContentMessageListener';
import SettingController from './controllers/SettingController';
import VersionController from './controllers/VersionController';

new SettingController().reload();
new VersionController().notifyIfUpdated();

new ContentMessageListener().run();
