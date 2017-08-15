import { expect } from "chai";
import KeyQueue from '../../src/background/key-queue';
import * as actions from '../../src/shared/actions';

describe("keyQueue class", () => {
  const KEYMAP = [
    { keys: [{ code: KeyboardEvent.DOM_VK_G }, { code: KeyboardEvent.DOM_VK_G }],
      action: [ actions.SCROLL_TOP ]},
    { keys: [{ code: KeyboardEvent.DOM_VK_J }],
      action: [ actions.SCROLL_DOWN ]},
  ]

  describe("#push", () => {
    it("returns matched action", () => {
      let queue = new KeyQueue(KEYMAP);
      queue.push({ code: KeyboardEvent.DOM_VK_G });
      let action = queue.push({ code: KeyboardEvent.DOM_VK_G });

      expect(action).to.deep.equal([ actions.SCROLL_TOP ]);
    });

    it("returns null on no actions matched", () => {
      let queue = new KeyQueue(KEYMAP);
      queue.push({ code: KeyboardEvent.DOM_VK_G });
      let action = queue.push({ code: KeyboardEvent.DOM_VK_X });

      expect(action).to.be.null;
    });
  });

  describe("#queuedKeys", () => {
    it("queues keys on matched actions exist", () => {
      let queue = new KeyQueue(KEYMAP);
      queue.push({ code: KeyboardEvent.DOM_VK_G });

      expect(queue.queuedKeys()).to.have.lengthOf(1);
    });

    it("flushs keys on no actions matched", () => {
      let queue = new KeyQueue(KEYMAP);
      queue.push({ code: KeyboardEvent.DOM_VK_G });
      queue.push({ code: KeyboardEvent.DOM_VK_Z });

      expect(queue.queuedKeys()).to.be.empty;
    });
  });
});
