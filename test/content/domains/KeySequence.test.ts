import KeySequence, * as utils from '../../../src/content/domains/KeySequence';
import Key from '../../../src/content/domains/Key';
import { expect } from 'chai'

describe("KeySequence", () => {
  describe('#push', () => {
    it('append a key to the sequence', () => {
      let seq = KeySequence.from([]);
      seq.push(Key.fromMapKey('g'));
      seq.push(Key.fromMapKey('<S-U>'));

      let array = seq.getKeyArray();
      expect(array[0].key).to.equal('g');
      expect(array[1].key).to.equal('U');
      expect(array[1].shift).to.be.true;
    })
  });

  describe('#startsWith', () => {
    it('returns true if the key sequence starts with param', () => {
      let seq = KeySequence.from([
        Key.fromMapKey('g'),
        Key.fromMapKey('<S-U>'),
      ]);

      expect(seq.startsWith(KeySequence.from([
      ]))).to.be.true;
      expect(seq.startsWith(KeySequence.from([
        Key.fromMapKey('g'),
      ]))).to.be.true;
      expect(seq.startsWith(KeySequence.from([
        Key.fromMapKey('g'), Key.fromMapKey('<S-U>'),
      ]))).to.be.true;
      expect(seq.startsWith(KeySequence.from([
        Key.fromMapKey('g'), Key.fromMapKey('<S-U>'), Key.fromMapKey('x'),
      ]))).to.be.false;
      expect(seq.startsWith(KeySequence.from([
        Key.fromMapKey('h'),
      ]))).to.be.false;
    });

    it('returns true if the empty sequence starts with an empty sequence', () => {
      let seq = KeySequence.from([]);

      expect(seq.startsWith(KeySequence.from([]))).to.be.true;
      expect(seq.startsWith(KeySequence.from([
        Key.fromMapKey('h'),
      ]))).to.be.false;
    })
  });

  describe('#fromMapKeys', () => {
    it('returns mapped keys for Shift+Esc', () => {
      let keyArray = utils.fromMapKeys('<S-Esc>').getKeyArray();
      expect(keyArray).to.have.lengthOf(1);
      expect(keyArray[0].key).to.equal('Esc');
      expect(keyArray[0].shift).to.be.true;
    });

    it('returns mapped keys for a<C-B><A-C>d<M-e>', () => {
      let keyArray = utils.fromMapKeys('a<C-B><A-C>d<M-e>').getKeyArray();
      expect(keyArray).to.have.lengthOf(5);
      expect(keyArray[0].key).to.equal('a');
      expect(keyArray[1].ctrl).to.be.true;
      expect(keyArray[1].key).to.equal('b');
      expect(keyArray[2].alt).to.be.true;
      expect(keyArray[2].key).to.equal('c');
      expect(keyArray[3].key).to.equal('d');
      expect(keyArray[4].meta).to.be.true;
      expect(keyArray[4].key).to.equal('e');
    });
  })
});
