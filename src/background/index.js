import ContentMessageListener from './infrastructures/content-message-listener';
import SettingController from './controllers/setting';
import VersionRepository from './controllers/version';

new SettingController().reload();
new VersionRepository().notifyIfUpdated();

new ContentMessageListener().run();
