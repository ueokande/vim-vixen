export default class GlobalMark {
  constructor(tabId, x, y) {
    this.tabId0 = tabId;
    this.x0 = x;
    this.y0 = y;
  }

  get tabId() {
    return this.tabId0;
  }

  get x() {
    return this.x0;
  }

  get y() {
    return this.y0;
  }
}
