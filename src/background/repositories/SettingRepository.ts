import MemoryStorage from '../infrastructures/MemoryStorage';
import Settings from '../../shared/Settings';
import * as PropertyDefs from '../../shared/property-defs';

const CACHED_SETTING_KEY = 'setting';

export default class SettingRepository {
  private cache: MemoryStorage;

  constructor() {
    this.cache = new MemoryStorage();
  }

  get(): Promise<Settings> {
    return Promise.resolve(this.cache.get(CACHED_SETTING_KEY));
  }

  update(value: Settings): void {
    return this.cache.set(CACHED_SETTING_KEY, value);
  }

  async setProperty(
    name: string, value: string | number | boolean,
  ): Promise<void> {
    let def = PropertyDefs.defs.find(d => name === d.name);
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
