import KeySequence, * as utils from '../../../src/content/domains/KeySequence';
import { expect } from 'chai'

describe("KeySequence", () => {
  describe('#push', () => {
    it('append a key to the sequence', () => {
      let seq = KeySequence.from([]);
      seq.push({ key: 'g' });
      seq.push({ key: 'u', shiftKey: true });

      let array = seq.getKeyArray();
      expect(array[0]).to.deep.equal({ key: 'g' });
      expect(array[1]).to.deep.equal({ key: 'u', shiftKey: true });
    })
  });

  describe('#startsWith', () => {
    it('returns true if the key sequence starts with param', () => {
      let seq = KeySequence.from([
        { key: 'g' },
        { key: 'u', shiftKey: true },
      ]);

      expect(seq.startsWith(KeySequence.from([
      ]))).to.be.true;
      expect(seq.startsWith(KeySequence.from([
        { key: 'g' },
      ]))).to.be.true;
      expect(seq.startsWith(KeySequence.from([
        { key: 'g' }, { key: 'u', shiftKey: true },
      ]))).to.be.true;
      expect(seq.startsWith(KeySequence.from([
        { key: 'g' }, { key: 'u', shiftKey: true }, { key: 'x' },
      ]))).to.be.false;
      expect(seq.startsWith(KeySequence.from([
        { key: 'h' },
      ]))).to.be.false;
    })

    it('returns true if the empty sequence starts with an empty sequence', () => {
      let seq = KeySequence.from([]);

      expect(seq.startsWith(KeySequence.from([]))).to.be.true;
      expect(seq.startsWith(KeySequence.from([
        { key: 'h' },
      ]))).to.be.false;
    })
  });

  describe('#fromMapKeys', () => {
    it('returns mapped keys for Shift+Esc', () => {
      let keyArray = utils.fromMapKeys('<S-Esc>').getKeyArray();
      expect(keyArray).to.have.lengthOf(1);
      expect(keyArray[0].key).to.equal('Esc');
      expect(keyArray[0].shiftKey).to.be.true;
    });

    it('returns mapped keys for a<C-B><A-C>d<M-e>', () => {
      let keyArray = utils.fromMapKeys('a<C-B><A-C>d<M-e>').getKeyArray();
      expect(keyArray).to.have.lengthOf(5);
      expect(keyArray[0].key).to.equal('a');
      expect(keyArray[1].ctrlKey).to.be.true;
      expect(keyArray[1].key).to.equal('b');
      expect(keyArray[2].altKey).to.be.true;
      expect(keyArray[2].key).to.equal('c');
      expect(keyArray[3].key).to.equal('d');
      expect(keyArray[4].metaKey).to.be.true;
      expect(keyArray[4].key).to.equal('e');
    });
  })

});
