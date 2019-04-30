import MemoryStorage from '../infrastructures/MemoryStorage';
import GlobalMark from '../domains/GlobalMark';

const MARK_KEY = 'mark';

export default class MarkRepository {
  constructor() {
    this.cache = new MemoryStorage();
  }

  getMark(key) {
    let marks = this.getOrEmptyMarks();
    let data = marks[key];
    if (!data) {
      return Promise.resolve(undefined);
    }
    let mark = new GlobalMark(data.tabId, data.url, data.x, data.y);
    return Promise.resolve(mark);
  }

  setMark(key, mark) {
    let marks = this.getOrEmptyMarks();
    marks[key] = { tabId: mark.tabId, url: mark.url, x: mark.x, y: mark.y };
    this.cache.set(MARK_KEY, marks);

    return Promise.resolve();
  }

  getOrEmptyMarks() {
    return this.cache.get(MARK_KEY) || {};
  }
}

