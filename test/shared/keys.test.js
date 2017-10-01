import { expect } from "chai";
import * as keys from '../../src/shared/keys';

describe("keys", () => {
  const KEYMAP = {
    'g<C-X>GG': [],
    'gg': { type: 'scroll.top' },
  };

  const g = 'g'.charCodeAt(0);
  const G = 'G'.charCodeAt(0);
  const x = 'x'.charCodeAt(0);

  describe('#asKeymapChars', () => {
    let keySequence = [
      { code: g },
      { code: x, ctrl: true },
      { code: G }
    ];
    expect(keys.asKeymapChars(keySequence)).to.equal('g<C-X>G');
  });

  describe('#asCaretChars', () => {
    let keySequence = [
      { code: g },
      { code: x, ctrl: true },
      { code: G }
    ];
    expect(keys.asCaretChars(keySequence)).to.equal('g^XG');
  });
});
