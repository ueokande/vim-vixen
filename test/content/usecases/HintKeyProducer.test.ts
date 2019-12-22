import HintKeyProducer from '../../../src/content/usecases/HintKeyProducer';
import { expect } from 'chai';

describe('HintKeyProducer class', () => {
  describe('#constructor', () => {
    it('throws an exception on empty charset', () => {
      expect(() => new HintKeyProducer('')).to.throw(TypeError);
    });
  });

  describe('#produce', () => {
    it('produce incremented keys', () => {
      const charset = 'abc';
      const sequences = [
        'a', 'b', 'c',
        'aa', 'ab', 'ac', 'ba', 'bb', 'bc', 'ca', 'cb', 'cc',
        'aaa', 'aab', 'aac', 'aba']

      const producer = new HintKeyProducer(charset);
      for (let i = 0; i < sequences.length; ++i) {
        expect(producer.produce()).to.equal(sequences[i]);
      }
    });
  });
});
