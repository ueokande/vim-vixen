import MemoryStorage from '../infrastructures/memory-storage';
import GlobalMark from 'background/domains/global-mark';

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
    let mark = new GlobalMark(data.tabId, data.x, data.y);
    return Promise.resolve(mark);
  }

  setMark(key, mark) {
    let marks = this.getOrEmptyMarks();
    marks[key] = { tabId: mark.tabId, x: mark.x, y: mark.y };
    this.cache.set(MARK_KEY, marks);

    return Promise.resolve();
  }

  getOrEmptyMarks() {
    return this.cache.get(MARK_KEY) || {};
  }
}

