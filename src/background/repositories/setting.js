import MemoryStorage from '../infrastructures/memory-storage';

const CACHED_SETTING_KEY = 'setting';

export default class SettingRepository {
  constructor() {
    this.cache = new MemoryStorage();
  }

  get() {
    return Promise.resolve(this.cache.get(CACHED_SETTING_KEY));
  }

  update(value) {
    return this.cache.set(CACHED_SETTING_KEY, value);
  }
}
