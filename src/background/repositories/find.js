import MemoryStorage from '../infrastructures/memory-storage';

const FIND_KEYWORD_KEY = 'find-keyword';

export default class FindRepository {
  constructor() {
    this.cache = new MemoryStorage();
  }

  getKeyword() {
    return Promise.resolve(this.cache.get(FIND_KEYWORD_KEY));
  }

  setKeyword(keyword) {
    this.cache.set(FIND_KEYWORD_KEY, keyword);
    return Promise.resolve();
  }
}

