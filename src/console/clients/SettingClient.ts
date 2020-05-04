import Settings from "../../shared/settings/Settings";
import * as messages from "../../shared/messages";
import ColorScheme from "../../shared/ColorScheme";

export default class SettingClient {
  async getColorScheme(): Promise<ColorScheme> {
    const json = await browser.runtime.sendMessage({
      type: messages.SETTINGS_QUERY,
    });
    const settings = Settings.fromJSON(json);
    return settings.properties.colorscheme;
  }
}
