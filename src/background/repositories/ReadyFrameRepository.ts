import MemoryStorage from "../infrastructures/MemoryStorage";

const REPOSITORY_KEY = "readyFrameRepository";

type State = { [tabId: number]: { [frameId: number]: number } };

export default interface ReadyFrameRepository {
  addFrameId(tabId: number, frameId: number): Promise<void>;

  removeFrameId(tabId: number, frameId: number): Promise<void>;

  getFrameIds(tabId: number): Promise<number[] | undefined>;
}

export class ReadyFrameRepositoryImpl implements ReadyFrameRepository {
  private cache: MemoryStorage;

  constructor() {
    this.cache = new MemoryStorage();
  }

  addFrameId(tabId: number, frameId: number): Promise<void> {
    let state: State | undefined = this.cache.get(REPOSITORY_KEY);
    if (typeof state === "undefined") {
      state = {};
    }
    const tab = state[tabId] || {};
    tab[frameId] = (tab[frameId] || 0) + 1;
    state[tabId] = tab;
    this.cache.set(REPOSITORY_KEY, state);
    return Promise.resolve();
  }

  removeFrameId(tabId: number, frameId: number): Promise<void> {
    const state: State | undefined = this.cache.get(REPOSITORY_KEY);
    if (typeof state === "undefined") {
      return Promise.resolve();
    }
    const ids = state[tabId];
    if (typeof ids === "undefined") {
      return Promise.resolve();
    }
    const tab = state[tabId] || {};
    tab[frameId] = (tab[frameId] || 0) - 1;
    if (tab[frameId] == 0) {
      delete tab[frameId];
    }
    if (Object.keys(tab).length === 0) {
      delete state[tabId];
    }

    this.cache.set(REPOSITORY_KEY, state);
    return Promise.resolve();
  }

  getFrameIds(tabId: number): Promise<number[] | undefined> {
    const state: State | undefined = this.cache.get(REPOSITORY_KEY);
    if (typeof state === "undefined") {
      return Promise.resolve(undefined);
    }
    const tab = state[tabId];
    if (typeof tab === "undefined") {
      return Promise.resolve(undefined);
    }
    const frameIds = Object.keys(tab)
      .map((v) => Number(v))
      .sort();
    return Promise.resolve(frameIds);
  }
}
