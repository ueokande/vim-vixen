import { expect } from 'chai'
import Key from '../../../src/shared/settings/Key';

describe("Key", () => {
  describe('fromMapKey', () => {
    it('return for X', () => {
      let key = Key.fromMapKey('x');
      expect(key.key).to.equal('x');
      expect(key.shift).to.be.false;
      expect(key.ctrl).to.be.false;
      expect(key.alt).to.be.false;
      expect(key.meta).to.be.false;
    });

    it('return for Shift+X', () => {
      let key = Key.fromMapKey('X');
      expect(key.key).to.equal('X');
      expect(key.shift).to.be.true;
      expect(key.ctrl).to.be.false;
      expect(key.alt).to.be.false;
      expect(key.meta).to.be.false;
    });

    it('return for Ctrl+X', () => {
      let key = Key.fromMapKey('<C-X>');
      expect(key.key).to.equal('x');
      expect(key.shift).to.be.false;
      expect(key.ctrl).to.be.true;
      expect(key.alt).to.be.false;
      expect(key.meta).to.be.false;
    });

    it('returns for Ctrl+Meta+X', () => {
      let key = Key.fromMapKey('<C-M-X>');
      expect(key.key).to.equal('x');
      expect(key.shift).to.be.false;
      expect(key.ctrl).to.be.true;
      expect(key.alt).to.be.false;
      expect(key.meta).to.be.true;
    });

    it('returns for Ctrl+Shift+x', () => {
      let key = Key.fromMapKey('<C-S-x>');
      expect(key.key).to.equal('X');
      expect(key.shift).to.be.true;
      expect(key.ctrl).to.be.true;
      expect(key.alt).to.be.false;
      expect(key.meta).to.be.false;
    });

    it('returns for Shift+Esc', () => {
      let key = Key.fromMapKey('<S-Esc>');
      expect(key.key).to.equal('Esc');
      expect(key.shift).to.be.true;
      expect(key.ctrl).to.be.false;
      expect(key.alt).to.be.false;
      expect(key.meta).to.be.false;
    });

    it('returns for Ctrl+Esc', () => {
      let key = Key.fromMapKey('<C-Esc>');
      expect(key.key).to.equal('Esc');
      expect(key.shift).to.be.false;
      expect(key.ctrl).to.be.true;
      expect(key.alt).to.be.false;
      expect(key.meta).to.be.false;
    });

    it('returns for Ctrl+Esc', () => {
      let key = Key.fromMapKey('<C-Space>');
      expect(key.key).to.equal('Space');
      expect(key.shift).to.be.false;
      expect(key.ctrl).to.be.true;
      expect(key.alt).to.be.false;
      expect(key.meta).to.be.false;
    });
  });

  describe('idDigit', () => {
    it('returns true if the key is a digit', () => {
        expect(new Key({ key: '0' }).isDigit()).to.be.true;
      expect(new Key({ key: '9' }).isDigit()).to.be.true;
      expect(new Key({ key: '9', shift: true }).isDigit()).to.be.true;

      expect(new Key({ key: 'a' }).isDigit()).to.be.false;
      expect(new Key({ key: '０' }).isDigit()).to.be.false;
    })
  });

  describe('equals', () => {
    it('returns true if the keys are equivalent', () => {
      expect(new Key({
        key: 'x', shift: false, ctrl: true, alt: false, meta: false,
      }).equals(new Key({
        key: 'x', shift: false, ctrl: true, alt: false, meta: false,
      }))).to.be.true;

      expect(new Key({
        key: 'x', shift: false, ctrl: false, alt: false, meta: false,
      }).equals(new Key({
        key: 'X', shift: true, ctrl: false, alt: false, meta: false,
      }))).to.be.false;
    })
  });
});
