import { expect } from "chai";
import FollowComponent from '../../src/components/follow';

describe('FollowComponent', () => {
  describe('#codeChars', () => {
    it('returns a string for key codes', () => {
      let chars = [
        KeyboardEvent.DOM_VK_0, KeyboardEvent.DOM_VK_1,
        KeyboardEvent.DOM_VK_A, KeyboardEvent.DOM_VK_B];
      expect(FollowComponent.codeChars(chars)).to.equal('01ab');
      expect(FollowComponent.codeChars([])).to.be.equal('');
    });
  });

  describe('#getTargetElements', () => {
    beforeEach(() => {
      document.body.innerHTML = __html__['test/components/follow.html'];
    });

    it('returns visible links', () => {
      let links = FollowComponent.getTargetElements(window.document);
      expect(links).to.have.lengthOf(1);
    });
  });
});
