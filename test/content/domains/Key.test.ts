import Key from '../../../src/content/domains/Key';
import { expect } from 'chai'

describe("Key", () => {
  describe('fromKeyboardEvent', () => {
    it('returns from keyboard input Ctrl+X', () => {
      let k = Key.fromKeyboardEvent(new KeyboardEvent('keydown', {
        key: 'x', shiftKey: false, ctrlKey: true, altKey: false, metaKey: true,
      }));
      expect(k.key).to.equal('x');
      expect(k.shift).to.be.false;
      expect(k.ctrl).to.be.true;
      expect(k.alt).to.be.false;
      expect(k.meta).to.be.true;
    });

    it('returns from keyboard input Shift+Esc', () => {
      let k = Key.fromKeyboardEvent(new KeyboardEvent('keydown', {
        key: 'Escape', shiftKey: true, ctrlKey: false, altKey: false, metaKey: true
      }));
      expect(k.key).to.equal('Esc');
      expect(k.shift).to.be.true;
      expect(k.ctrl).to.be.false;
      expect(k.alt).to.be.false;
      expect(k.meta).to.be.true;
    });

    it('returns from keyboard input Ctrl+$', () => {
      // $ required shift pressing on most keyboards
      let k = Key.fromKeyboardEvent(new KeyboardEvent('keydown', {
        key: '$', shiftKey: true, ctrlKey: true, altKey: false, metaKey: false
      }));
      expect(k.key).to.equal('$');
      expect(k.shift).to.be.false;
      expect(k.ctrl).to.be.true;
      expect(k.alt).to.be.false;
      expect(k.meta).to.be.false;
    });

    it('returns from keyboard input Crtl+Space', () => {
      let k = Key.fromKeyboardEvent(new KeyboardEvent('keydown', {
        key: ' ', shiftKey: false, ctrlKey: true, altKey: false, metaKey: false
      }));
      expect(k.key).to.equal('Space');
      expect(k.shift).to.be.false;
      expect(k.ctrl).to.be.true;
      expect(k.alt).to.be.false;
      expect(k.meta).to.be.false;
    });
  });

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

  describe('equals', () => {
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
  });
});
