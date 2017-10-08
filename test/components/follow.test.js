import { expect } from "chai";
import FollowComponent from 'components/follow';

describe('FollowComponent', () => {
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
