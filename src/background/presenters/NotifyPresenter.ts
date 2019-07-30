import { injectable } from 'tsyringe';

const NOTIFICATION_ID = 'vimvixen-update';

@injectable()
export default class NotifyPresenter {
  async notifyUpdated(version: string, onclick: () => void): Promise<void> {
    let title = `Vim Vixen ${version} has been installed`;
    let message = 'Click here to see release notes';
    await this.notify(title, message, onclick);
  }

  async notifyInvalidSettings(onclick: () => void): Promise<void> {
    let title = `Loaded settings is invalid`;
    // eslint-disable-next-line max-len
    let message = 'The default settings is used due to the last saved settings is invalid.  Check your current settings from the add-on preference';
    await this.notify(title, message, onclick);
  }

  private async notify(
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
