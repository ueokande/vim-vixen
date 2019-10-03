import KeySequence from '../../../src/content/domains/KeySequence';
import Key from '../../../src/content/domains/Key';
import { expect } from 'chai'

describe("KeySequence", () => {
  describe('#push', () => {
    it('append a key to the sequence', () => {
      let seq = new KeySequence([]);
      seq.push(Key.fromMapKey('g'));
      seq.push(Key.fromMapKey('<S-U>'));

      expect(seq.keys[0].key).to.equal('g');
      expect(seq.keys[1].key).to.equal('U');
      expect(seq.keys[1].shift).to.be.true;
    })
  });

  describe('#startsWith', () => {
    it('returns true if the key sequence starts with param', () => {
      let seq = new KeySequence([
        Key.fromMapKey('g'),
        Key.fromMapKey('<S-U>'),
      ]);

      expect(seq.startsWith(new KeySequence([
      ]))).to.be.true;
      expect(seq.startsWith(new KeySequence([
        Key.fromMapKey('g'),
      ]))).to.be.true;
      expect(seq.startsWith(new KeySequence([
        Key.fromMapKey('g'), Key.fromMapKey('<S-U>'),
      ]))).to.be.true;
      expect(seq.startsWith(new KeySequence([
        Key.fromMapKey('g'), Key.fromMapKey('<S-U>'), Key.fromMapKey('x'),
      ]))).to.be.false;
      expect(seq.startsWith(new KeySequence([
        Key.fromMapKey('h'),
      ]))).to.be.false;
    });

    it('returns true if the empty sequence starts with an empty sequence', () => {
      let seq = new KeySequence([]);

      expect(seq.startsWith(new KeySequence([]))).to.be.true;
      expect(seq.startsWith(new KeySequence([
        Key.fromMapKey('h'),
      ]))).to.be.false;
    })
  });

  describe('#fromMapKeys', () => {
    it('returns mapped keys for Shift+Esc', () => {
      let keys = KeySequence.fromMapKeys('<S-Esc>').keys;
      expect(keys).to.have.lengthOf(1);
      expect(keys[0].key).to.equal('Esc');
      expect(keys[0].shift).to.be.true;
    });

    it('returns mapped keys for a<C-B><A-C>d<M-e>', () => {
      let keys = KeySequence.fromMapKeys('a<C-B><A-C>d<M-e>').keys;
      expect(keys).to.have.lengthOf(5);
      expect(keys[0].key).to.equal('a');
      expect(keys[1].ctrl).to.be.true;
      expect(keys[1].key).to.equal('b');
      expect(keys[2].alt).to.be.true;
      expect(keys[2].key).to.equal('c');
      expect(keys[3].key).to.equal('d');
      expect(keys[4].meta).to.be.true;
      expect(keys[4].key).to.equal('e');
    });
  })
});
