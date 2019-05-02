const NOTIFICATION_ID = 'vimvixen-update';

export default class NotifyPresenter {
  async notify(
    title: string,
    message: string,
    onclick: () => void,
  ): Promise<void> {
    const listener = (id: string) => {
      if (id !== NOTIFICATION_ID) {
        return;
      }

      onclick();

      browser.notifications.onClicked.removeListener(listener);
    };
    browser.notifications.onClicked.addListener(listener);

    await browser.notifications.create(NOTIFICATION_ID, {
      'type': 'basic',
      'iconUrl': browser.extension.getURL('resources/icon_48x48.png'),
      title,
      message,
    });
  }
}
