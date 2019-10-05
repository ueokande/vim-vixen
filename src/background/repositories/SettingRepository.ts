import { injectable } from 'tsyringe';
import MemoryStorage from '../infrastructures/MemoryStorage';
import Settings, { valueOf, toJSON } from '../../shared/Settings';
import Properties from '../../shared/settings/Properties';

const CACHED_SETTING_KEY = 'setting';

@injectable()
export default class SettingRepository {
  private cache: MemoryStorage;

  constructor() {
    this.cache = new MemoryStorage();
  }

  get(): Promise<Settings> {
    let data = this.cache.get(CACHED_SETTING_KEY);
    return Promise.resolve(valueOf(data));
  }

  update(value: Settings): void {
    let data = toJSON(value);
    return this.cache.set(CACHED_SETTING_KEY, data);
  }

  async setProperty(
    name: string, value: string | number | boolean,
  ): Promise<void> {
    let def = Properties.def(name);
    if (!def) {
      throw new Error('unknown property: ' + name);
    }
    if (typeof value !== def.type) {
      throw new TypeError(`property type of ${name} mismatch: ${typeof value}`);
    }
    let newValue = value;
    if (typeof value === 'string' && value === '') {
      newValue = def.defaultValue;
    }

    let current = await this.get();
    switch (name) {
    case 'hintchars':
      current.properties.hintchars = newValue as string;
      break;
    case 'smoothscroll':
      current.properties.smoothscroll = newValue as boolean;
      break;
    case 'complete':
      current.properties.complete = newValue as string;
      break;
    }
    return this.update(current);
  }
}
