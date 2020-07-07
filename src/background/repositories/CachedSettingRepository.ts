import MemoryStorage from "../infrastructures/MemoryStorage";
import Settings from "../../shared/settings/Settings";
import Properties from "../../shared/settings/Properties";
import ColorScheme from "../../shared/ColorScheme";

const CACHED_SETTING_KEY = "setting";

export default interface CachedSettingRepository {
  get(): Promise<Settings>;

  update(value: Settings): Promise<void>;

  setProperty(name: string, value: string | number | boolean): Promise<void>;
}

export class CachedSettingRepositoryImpl implements CachedSettingRepository {
  private cache: MemoryStorage;

  constructor() {
    this.cache = new MemoryStorage();
  }

  get(): Promise<Settings> {
    const data = this.cache.get(CACHED_SETTING_KEY);
    return Promise.resolve(Settings.fromJSON(data));
  }

  update(value: Settings): Promise<void> {
    this.cache.set(CACHED_SETTING_KEY, value.toJSON());
    return Promise.resolve();
  }

  async setProperty(
    name: string,
    value: string | number | boolean
  ): Promise<void> {
    const def = Properties.def(name);
    if (!def) {
      throw new Error("unknown property: " + name);
    }
    if (typeof value !== def.type) {
      throw new TypeError(`property type of ${name} mismatch: ${typeof value}`);
    }
    let newValue = value;
    if (typeof value === "string" && value === "") {
      newValue = def.defaultValue;
    }

    const current = await this.get();
    switch (name) {
      case "hintchars":
        current.properties.hintchars = newValue as string;
        break;
      case "smoothscroll":
        current.properties.smoothscroll = newValue as boolean;
        break;
      case "complete":
        current.properties.complete = newValue as string;
        break;
      case "colorscheme": {
        switch (newValue) {
          case ColorScheme.Light:
          case ColorScheme.Dark:
          case ColorScheme.System:
            current.properties.colorscheme = newValue as ColorScheme;
            break;
          default:
            throw new Error(`Unsupported colorscheme: ${newValue}`);
        }
        break;
      }
      case "searchOnlyCurrentWin":
        current.properties.searchOnlyCurrentWin = newValue as boolean;
        break;

    }
    await this.update(current);
  }
}
