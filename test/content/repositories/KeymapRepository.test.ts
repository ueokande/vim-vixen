import KeymapRepository, { KeymapRepositoryImpl }
  from '../../../src/content/repositories/KeymapRepository';
import { expect } from 'chai';
import Key from "../../../src/shared/settings/Key";

describe('KeymapRepositoryImpl', () => {
  let sut: KeymapRepository;

  before(() => {
    sut = new KeymapRepositoryImpl();
  });

  describe('#enqueueKey()', () => {
    it('enqueues keys', () => {
      sut.enqueueKey(Key.fromMapKey('a'));
      sut.enqueueKey(Key.fromMapKey('b'));
      const sequence = sut.enqueueKey(Key.fromMapKey('c'));

      const keys = sequence.keys;
      expect(keys[0].equals(Key.fromMapKey('a'))).to.be.true;
      expect(keys[1].equals(Key.fromMapKey('b'))).to.be.true;
      expect(keys[2].equals(Key.fromMapKey('c'))).to.be.true;
    });
  });

  describe('#clear()', () => {
    it('clears keys', () => {
      sut.enqueueKey(Key.fromMapKey('a'));
      sut.enqueueKey(Key.fromMapKey('b'));
      sut.enqueueKey(Key.fromMapKey('c'));
      sut.clear();

      const sequence = sut.enqueueKey(Key.fromMapKey('a'));
      expect(sequence.length()).to.equal(1);
    });
  });
});


