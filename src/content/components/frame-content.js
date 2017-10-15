import CommonComponent from './common';

export default class FrameContent {

  constructor(win, store) {
    this.children = [new CommonComponent(win, store)];
  }

  update() {
    this.children.forEach(c => c.update());
  }

  onMessage(message) {
    this.children.forEach(c => c.onMessage(message));
  }
}
