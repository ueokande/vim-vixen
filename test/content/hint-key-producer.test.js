import { expect } from "chai";
import HintKeyProducer from 'content/hint-key-producer';

describe('HintKeyProducer class', () => {
  describe('#constructor', () => {
    it('throws an exception on empty charset', () => {
      expect(() => new HintKeyProducer([])).to.throw(TypeError);
    });
  });

  describe('#produce', () => {
    it('produce incremented keys', () => {
      let charset = 'abc';
      let sequences = [
        'a', 'b', 'c',
        'aa', 'ab', 'ac', 'ba', 'bb', 'bc', 'ca', 'cb', 'cc',
        'aaa', 'aab', 'aac', 'aba']

      let producer = new HintKeyProducer(charset);
      for (let i = 0; i < sequences.length; ++i) {
        expect(producer.produce()).to.equal(sequences[i]);
      }
    });
  });
});
