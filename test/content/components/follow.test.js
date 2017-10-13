import { expect } from "chai";
import FollowComponent from 'content/components/follow';

describe('FollowComponent', () => {
  describe('#getTargetElements', () => {
    beforeEach(() => {
      document.body.innerHTML = __html__['test/content/components/follow.html'];
    });

    it('returns visible links', () => {
      let targets = FollowComponent.getTargetElements(window);
      expect(targets).to.have.lengthOf(3);

      let ids = Array.prototype.map.call(targets, (e) => e.id);
      expect(ids).to.include.members(['visible_a', 'editable_div_1', 'editable_div_2']);
    });
  });
});
