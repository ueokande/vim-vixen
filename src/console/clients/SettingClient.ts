import Settings from "../../shared/settings/Settings";
import * as messages from "../../shared/messages";
import ColorScheme from "../../shared/ColorScheme";
import Properties from "../../shared/settings/Properties";

export default class SettingClient {

  private async getProperties(): Promise<Properties> {
    const json = await browser.runtime.sendMessage({
      type: messages.SETTINGS_QUERY,
    });
    const settings = Settings.fromJSON(json);
    return settings.properties;
  }

  async getColorScheme(): Promise<ColorScheme> {
    return (await this.getProperties()).colorscheme;
  }

  async shouldSearchOnlyCurrentWin(): Promise<boolean> {
    return (await this.getProperties()).searchOnlyCurrentWin;
  }
}
