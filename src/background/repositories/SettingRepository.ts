import MemoryStorage from '../infrastructures/MemoryStorage';

const CACHED_SETTING_KEY = 'setting';

export default class SettingRepository {
  private cache: MemoryStorage;

  constructor() {
    this.cache = new MemoryStorage();
  }

  get(): Promise<any> {
    return Promise.resolve(this.cache.get(CACHED_SETTING_KEY));
  }

  update(value: any): any {
    return this.cache.set(CACHED_SETTING_KEY, value);
  }

  async setProperty(name: string, value: string): Promise<any> {
    let current = await this.get();
    current.properties[name] = value;
    return this.update(current);
  }
}
