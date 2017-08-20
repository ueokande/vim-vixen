import { expect } from "chai";
import Follow from '../../src/content/follow';

describe('Follow class', () => {
  describe('#codeChars', () => {
    it('returns a string for key codes', () => {
      let chars = [
        KeyboardEvent.DOM_VK_0, KeyboardEvent.DOM_VK_1,
        KeyboardEvent.DOM_VK_A, KeyboardEvent.DOM_VK_B];
      expect(Follow.codeChars(chars)).to.equal('01ab');
      expect(Follow.codeChars([])).to.be.equal('');
    });
  });
});
