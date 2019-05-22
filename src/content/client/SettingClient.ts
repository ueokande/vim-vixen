import Settings from '../../shared/Settings';
import * as messages from '../../shared/messages';

export default interface SettingClient {
  load(): Promise<Settings>;
}

export class SettingClientImpl {
  async load(): Promise<Settings> {
    let settings = await browser.runtime.sendMessage({
      type: messages.SETTINGS_QUERY,
    });
    return settings as Settings;
  }
}
