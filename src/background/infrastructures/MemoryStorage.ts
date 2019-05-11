const db: {[key: string]: any} = {};

export default class MemoryStorage {
  set(name: string, value: any): void {
    let data = JSON.stringify(value);
    if (typeof data === 'undefined') {
      throw new Error('value is not serializable');
    }
    db[name] = data;
  }

  get(name: string): any {
    let data = db[name];
    if (!data) {
      return undefined;
    }
    return JSON.parse(data);
  }
}
