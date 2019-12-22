import KeySequence from '../../../src/content/domains/KeySequence';
import { expect } from 'chai'
import Key from "../../../src/shared/settings/Key";

describe("KeySequence", () => {
  describe('#push', () => {
    it('append a key to the sequence', () => {
      const seq = new KeySequence([]);
      seq.push(Key.fromMapKey('g'));
      seq.push(Key.fromMapKey('<S-U>'));

      expect(seq.keys[0].key).to.equal('g');
      expect(seq.keys[1].key).to.equal('U');
      expect(seq.keys[1].shift).to.be.true;
    })
  });

  describe('#startsWith', () => {
    it('returns true if the key sequence starts with param', () => {
      const seq = new KeySequence([
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
      const seq = new KeySequence([]);

      expect(seq.startsWith(new KeySequence([]))).to.be.true;
      expect(seq.startsWith(new KeySequence([
        Key.fromMapKey('h'),
      ]))).to.be.false;
    })
  });

  describe('#isDigitOnly', () => {
      it('returns true the keys are only digits', () => {
        expect(new KeySequence([
          new Key({ key: '4' }),
          new Key({ key: '0' }),
        ]).isDigitOnly()).to.be.true;
        expect(new KeySequence([
          new Key({ key: '4' }),
          new Key({ key: '0' }),
          new Key({ key: 'z' }),
        ]).isDigitOnly()).to.be.false;
      })
  });

  describe('#repeatCount', () => {
    it('returns repeat count with a numeric prefix', () => {
      let seq = new KeySequence([
        new Key({ key: '1' }), new Key({ key: '0' })  ,
        new Key({ key: 'g' }), new Key({ key: 'g' })  ,
      ]);
      expect(seq.repeatCount()).to.equal(10);

      seq = new KeySequence([
        new Key({ key: '0' }), new Key({ key: '5' })  ,
        new Key({ key: 'g' }), new Key({ key: 'g' })  ,
      ]);
      expect(seq.repeatCount()).to.equal(5);
    });

    it('returns 1 if no numeric prefix', () => {
      let seq = new KeySequence([
        new Key({ key: 'g' }), new Key({ key: 'g' })  ,
      ]);
      expect(seq.repeatCount()).to.equal(1);

      seq = new KeySequence([]);
      expect(seq.repeatCount()).to.equal(1);
    });

    it('returns whole keys if digits only sequence', () => {
      let seq = new KeySequence([
        new Key({ key: '1' }), new Key({ key: '0' })  ,
      ]);
      expect(seq.repeatCount()).to.equal(10);

      seq = new KeySequence([
        new Key({ key: '0' }), new Key({ key: '5' })  ,
      ]);
      expect(seq.repeatCount()).to.equal(5);
    });
  });

  describe('#trimNumericPrefix', () => {
    it('removes numeric prefix', () => {
      const seq = new KeySequence([
        new Key({ key: '1' }), new Key({ key: '0' }) ,
        new Key({ key: 'g' }), new Key({ key: 'g' }) , new Key({ key: '3' })  ,
      ]).trimNumericPrefix();
      expect(seq.keys.map(key => key.key)).to.deep.equal(['g', 'g', '3']);
    });

    it('returns empty if keys contains only digis', () => {
      const seq = new KeySequence([
        new Key({ key: '1' }), new Key({ key: '0' })  ,
      ]).trimNumericPrefix();
      expect(seq.trimNumericPrefix().keys).to.be.empty;
    });

    it('returns itself if no numeric prefix', () => {
      const seq = new KeySequence([
        new Key({ key: 'g' }), new Key({ key: 'g' }) , new Key({ key: '3' })  ,
      ]).trimNumericPrefix();

      expect(seq.keys.map(key => key.key)).to.deep.equal(['g', 'g', '3']);
    });
  });

  describe('#splitNumericPrefix', () => {
      it('splits numeric prefix', () => {
        expect(KeySequence.fromMapKeys('10gg').splitNumericPrefix()).to.deep.equal([
          KeySequence.fromMapKeys('10'),
          KeySequence.fromMapKeys('gg'),
        ]);
        expect(KeySequence.fromMapKeys('10').splitNumericPrefix()).to.deep.equal([
          KeySequence.fromMapKeys('10'),
          new KeySequence([]),
        ]);
        expect(KeySequence.fromMapKeys('gg').splitNumericPrefix()).to.deep.equal([
          new KeySequence([]),
          KeySequence.fromMapKeys('gg'),
        ]);
      });
  });

  describe('#fromMapKeys', () => {
    it('returns mapped keys for Shift+Esc', () => {
      const keys = KeySequence.fromMapKeys('<S-Esc>').keys;
      expect(keys).to.have.lengthOf(1);
      expect(keys[0].key).to.equal('Esc');
      expect(keys[0].shift).to.be.true;
    });

    it('returns mapped keys for a<C-B><A-C>d<M-e>', () => {
      const keys = KeySequence.fromMapKeys('a<C-B><A-C>d<M-e>').keys;
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
