import Settings from '../../shared/settings/Settings';
import * as messages from '../../shared/messages';

export default interface SettingClient {
  load(): Promise<Settings>;
}

export class SettingClientImpl {
  async load(): Promise<Settings> {
    const settings = await browser.runtime.sendMessage({
      type: messages.SETTINGS_QUERY,
    });
    return Settings.fromJSON(settings);
  }
}
