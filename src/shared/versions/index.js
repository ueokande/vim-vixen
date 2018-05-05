import * as storage from './storage';
import * as releaseNotes from './release-notes';
import manifest from '../../../manifest.json';

const NOTIFICATION_ID = 'vimvixen-update';

const notificationClickListener = (id) => {
  if (id !== NOTIFICATION_ID) {
    return;
  }

  browser.tabs.create({ url: releaseNotes.url(manifest.version) });
  browser.notifications.onClicked.removeListener(notificationClickListener);
};

const checkUpdated = () => {
  return storage.load().then((prev) => {
    if (!prev) {
      return true;
    }
    return manifest.version !== prev;
  });
};

const notify = () => {
  browser.notifications.onClicked.addListener(notificationClickListener);
  return browser.notifications.create(NOTIFICATION_ID, {
    'type': 'basic',
    'iconUrl': browser.extension.getURL('resources/icon_48x48.png'),
    'title': 'Vim Vixen ' + manifest.version + ' has been installed',
    'message': 'Click here to see release notes',
  });
};

const commit = () => {
  storage.save(manifest.version);
};

export { checkUpdated, notify, commit };
