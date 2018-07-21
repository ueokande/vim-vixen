const db = {};

export default class MemoryStorage {
  set(name, value) {
    db[name] = value;
  }

  get(name) {
    return db[name];
  }
}
