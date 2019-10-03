import KeymapRepository, { KeymapRepositoryImpl }
  from '../../../src/content/repositories/KeymapRepository';
import Key from '../../../src/content/domains/Key'
import { expect } from 'chai';

describe('KeymapRepositoryImpl', () => {
  let sut: KeymapRepository;

  before(() => {
    sut = new KeymapRepositoryImpl();
  });

  describe('#enqueueKey()', () => {
    it('enqueues keys', () => {
      sut.enqueueKey(Key.fromMapKey('a');
      sut.enqueueKey(Key.fromMapKey('b');
      let sequence = sut.enqueueKey(Key.fromMapKey('c'));

      let keys = sequence.getKeyArray();
      expect(keys[0].equals(Key.fromMapKey('a'))).to.be.true;
      expect(keys[1].equals(Key.fromMapKey('b'))).to.be.true;
      expect(keys[2].equals(Key.fromMapKey('c'))).to.be.true;
    });
  });

  describe('#clear()', () => {
    it('clears keys', () => {
      sut.enqueueKey(Key.fromMapKey('a');
      sut.enqueueKey(Key.fromMapKey('b');
      sut.enqueueKey(Key.fromMapKey('c');
      sut.clear();

      let sequence = sut.enqueueKey(Key.fromMapKey('a'));
      expect(sequence.length()).to.equal(1);
    });
  });
});


