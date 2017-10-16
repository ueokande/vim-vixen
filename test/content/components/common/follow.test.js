import { expect } from "chai";
import FollowComponent from 'content/components/common/follow';

describe('FollowComponent', () => {
  describe('#getTargetElements', () => {
    beforeEach(() => {
      document.body.innerHTML = __html__['test/content/components/common/follow.html'];
    });

    it('returns visible links', () => {
      let targets = FollowComponent.getTargetElements(
        window,
        { width: window.innerWidth, height: window.innerHeight },
        { x: 0, y: 0 });
      expect(targets).to.have.lengthOf(3);

      let ids = Array.prototype.map.call(targets, (e) => e.id);
      expect(ids).to.include.members(['visible_a', 'editable_div_1', 'editable_div_2']);
    });
  });
});
