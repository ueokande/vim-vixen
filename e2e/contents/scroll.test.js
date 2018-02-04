import { expect } from "chai";
import * as windows from "../ambassador/src/client/windows";

describe("scroll test", () => {
  let targetWindow;
  before(() => {
    return windows.create().then((win) => {
      targetWindow = win;
    });
  });

  after(() => {
    return windows.remove(targetWindow.id);
  });

  it('runs test', () => {
    expect(targetWindow.id).be.a('number');
  });
});
