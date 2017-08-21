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

  describe('#getTargetElements', () => {
    beforeEach(() => {
      document.body.innerHTML = __html__['test/content/follow.html'];
    });

    it('returns visible links', () => {
      let links = Follow.getTargetElements(window.document);
      expect(links).to.have.lengthOf(1);
    });
  });
});
