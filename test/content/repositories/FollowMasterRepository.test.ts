import FollowMasterRepository, { FollowMasterRepositoryImpl }
  from '../../../src/content/repositories/FollowMasterRepository';
import { expect } from 'chai';

describe('FollowMasterRepositoryImpl', () => {
  let sut: FollowMasterRepository;

  before(() => {
    sut = new FollowMasterRepositoryImpl();
  });

  describe('#getTags()/#addTag()/#clearTags()', () => {
    it('gets, adds and clears tags', () => {
      expect(sut.getTags()).to.be.empty;

      sut.addTag('a');
      sut.addTag('b');
      sut.addTag('c');
      expect(sut.getTags()).to.deep.equal(['a', 'b', 'c']);

      sut.clearTags();
      expect(sut.getTags()).to.be.empty;
    });
  });

  describe('#getTagsByPrefix', () => {
    it('gets tags matched by prefix', () => {
      for (let tag of ['a', 'aa', 'ab', 'b', 'ba', 'bb']) {
        sut.addTag(tag);
      }
      expect(sut.getTagsByPrefix('a')).to.deep.equal(['a', 'aa', 'ab']);
      expect(sut.getTagsByPrefix('aa')).to.deep.equal(['aa']);
      expect(sut.getTagsByPrefix('b')).to.deep.equal(['b', 'ba', 'bb']);
      expect(sut.getTagsByPrefix('c')).to.be.empty;
    });
  });

  describe('#setCurrentFollowMode()/#getCurrentNewTabMode()/#getCurrentBackgroundMode', () => {
    it('updates and gets follow mode', () => {
      sut.setCurrentFollowMode(false, true);
      expect(sut.getCurrentNewTabMode()).to.be.false;
      expect(sut.getCurrentBackgroundMode()).to.be.true;

      sut.setCurrentFollowMode(true, false);
      expect(sut.getCurrentNewTabMode()).to.be.true;
      expect(sut.getCurrentBackgroundMode()).to.be.false;
    });
  });
});
