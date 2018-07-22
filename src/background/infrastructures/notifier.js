const NOTIFICATION_ID = 'vimvixen-update';

export default class Notifier {
  notify(title, message, onclick) {
    const listener = (id) => {
      if (id !== NOTIFICATION_ID) {
        return;
      }

      onclick();

      browser.notifications.onClicked.removeListener(listener);
    };
    browser.notifications.onClicked.addListener(listener);

    return browser.notifications.create(NOTIFICATION_ID, {
      'type': 'basic',
      'iconUrl': browser.extension.getURL('resources/icon_48x48.png'),
      title,
      message,
    });
  }
}
