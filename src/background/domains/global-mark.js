export default class GlobalMark {
  constructor(tabId, url, x, y) {
    this.tabId0 = tabId;
    this.url0 = url;
    this.x0 = x;
    this.y0 = y;
  }

  get tabId() {
    return this.tabId0;
  }

  get url() {
    return this.url0;
  }

  get x() {
    return this.x0;
  }

  get y() {
    return this.y0;
  }
}
