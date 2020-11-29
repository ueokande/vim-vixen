import ScrollPresenter, {
  Point,
} from "../../../src/content/presenters/ScrollPresenter";

export default class MockScrollPresenter implements ScrollPresenter {
  private readonly pos: Point;

  constructor(initX = 0, initY = 0) {
    this.pos = { x: initX, y: initY };
  }

  getScroll(): Point {
    return this.pos;
  }

  scrollVertically(amount: number, _smooth: boolean): void {
    this.pos.y += amount;
  }

  scrollHorizonally(amount: number, _smooth: boolean): void {
    this.pos.x += amount;
  }

  scrollPages(amount: number, _smooth: boolean): void {
    this.pos.x += amount;
  }

  scrollTo(x: number, y: number, _smooth: boolean): void {
    this.pos.x = x;
    this.pos.y = y;
  }

  scrollToTop(_smooth: boolean): void {
    this.pos.y = 0;
  }

  scrollToBottom(_smooth: boolean): void {
    this.pos.y = Infinity;
  }

  scrollToHome(_smooth: boolean): void {
    this.pos.x = 0;
  }

  scrollToEnd(_smooth: boolean): void {
    this.pos.x = Infinity;
  }
}
