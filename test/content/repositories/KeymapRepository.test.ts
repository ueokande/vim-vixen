import KeymapRepository, { KeymapRepositoryImpl }
  from '../../../src/content/repositories/KeymapRepository';
import { expect } from 'chai';

describe('KeymapRepositoryImpl', () => {
  let sut: KeymapRepository;

  before(() => {
    sut = new KeymapRepositoryImpl();
  });

  describe('#enqueueKey()', () => {
    it('enqueues keys', () => {
      sut.enqueueKey({ key: 'a' });
      sut.enqueueKey({ key: 'b' });
      let sequence = sut.enqueueKey({ key: 'c' });

      expect(sequence.getKeyArray()).deep.equals([
        { key: 'a' }, { key: 'b' }, { key: 'c' },
      ]);
    });
  });

  describe('#clear()', () => {
    it('clears keys', () => {
      sut.enqueueKey({ key: 'a' });
      sut.enqueueKey({ key: 'b' });
      sut.enqueueKey({ key: 'c' });
      sut.clear();

      let sequence = sut.enqueueKey({ key: 'a' });
      expect(sequence.length()).to.equal(1);
    });
  });
});


