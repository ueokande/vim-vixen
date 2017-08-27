import { expect } from "chai";
import KeyQueue from '../../src/background/key-queue';

describe("keyQueue class", () => {
  const KEYMAP = {
    'g<C-X>GG': [],
    'gg': [ 'scroll.top' ],
  };

  const g = 'g'.charCodeAt(0);
  const G = 'G'.charCodeAt(0);
  const x = 'x'.charCodeAt(0);

  describe("#push", () => {
    it("returns matched action", () => {
      let queue = new KeyQueue(KEYMAP);
      queue.push({ code: g });
      let action = queue.push({ code: g });

      expect(action).to.deep.equal([ 'scroll.top' ]);
    });

    it("returns null on no actions matched", () => {
      let queue = new KeyQueue(KEYMAP);
      queue.push({ code: g });
      let action = queue.push({ code: G });

      expect(action).to.be.null;
      expect(queue.asKeymapChars()).to.be.empty;
    });
  });

  describe('#asKeymapChars', () => {
    let queue = new KeyQueue(KEYMAP);
    queue.push({ code: g });
    queue.push({ code: x, ctrl: true });
    queue.push({ code: G });

    expect(queue.asKeymapChars()).to.equal('g<C-X>G');
  });

  describe('#asCaretChars', () => {
    let queue = new KeyQueue(KEYMAP);
    queue.push({ code: g });
    queue.push({ code: x, ctrl: true });
    queue.push({ code: G });

    expect(queue.asCaretChars()).to.equal('g^XG');
  });
});
