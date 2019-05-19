import Key, * as keys from '../../../src/content/domains/Key';
import { expect } from 'chai'

describe("Key", () => {
  describe('fromKeyboardEvent', () => {
    it('returns from keyboard input Ctrl+X', () => {
      let k = keys.fromKeyboardEvent(new KeyboardEvent('keydown', {
        key: 'x', shiftKey: false, ctrlKey: true, altKey: false, metaKey: true,
      }));
      expect(k.key).to.equal('x');
      expect(k.shiftKey).to.be.false;
      expect(k.ctrlKey).to.be.true;
      expect(k.altKey).to.be.false;
      expect(k.metaKey).to.be.true;
    });

    it('returns from keyboard input Shift+Esc', () => {
      let k = keys.fromKeyboardEvent(new KeyboardEvent('keydown', {
        key: 'Escape', shiftKey: true, ctrlKey: false, altKey: false, metaKey: true
      }));
      expect(k.key).to.equal('Esc');
      expect(k.shiftKey).to.be.true;
      expect(k.ctrlKey).to.be.false;
      expect(k.altKey).to.be.false;
      expect(k.metaKey).to.be.true;
    });

    it('returns from keyboard input Ctrl+$', () => {
      // $ required shift pressing on most keyboards
      let k = keys.fromKeyboardEvent(new KeyboardEvent('keydown', {
        key: '$', shiftKey: true, ctrlKey: true, altKey: false, metaKey: false
      }));
      expect(k.key).to.equal('$');
      expect(k.shiftKey).to.be.false;
      expect(k.ctrlKey).to.be.true;
      expect(k.altKey).to.be.false;
      expect(k.metaKey).to.be.false;
    });

    it('returns from keyboard input Crtl+Space', () => {
      let k = keys.fromKeyboardEvent(new KeyboardEvent('keydown', {
        key: ' ', shiftKey: false, ctrlKey: true, altKey: false, metaKey: false
      }));
      expect(k.key).to.equal('Space');
      expect(k.shiftKey).to.be.false;
      expect(k.ctrlKey).to.be.true;
      expect(k.altKey).to.be.false;
      expect(k.metaKey).to.be.false;
    });
  });

  describe('fromMapKey', () => {
    it('return for X', () => {
      let key = keys.fromMapKey('x');
      expect(key.key).to.equal('x');
      expect(key.shiftKey).to.be.false;
      expect(key.ctrlKey).to.be.false;
      expect(key.altKey).to.be.false;
      expect(key.metaKey).to.be.false;
    });

    it('return for Shift+X', () => {
      let key = keys.fromMapKey('X');
      expect(key.key).to.equal('X');
      expect(key.shiftKey).to.be.true;
      expect(key.ctrlKey).to.be.false;
      expect(key.altKey).to.be.false;
      expect(key.metaKey).to.be.false;
    });

    it('return for Ctrl+X', () => {
      let key = keys.fromMapKey('<C-X>');
      expect(key.key).to.equal('x');
      expect(key.shiftKey).to.be.false;
      expect(key.ctrlKey).to.be.true;
      expect(key.altKey).to.be.false;
      expect(key.metaKey).to.be.false;
    });

    it('returns for Ctrl+Meta+X', () => {
      let key = keys.fromMapKey('<C-M-X>');
      expect(key.key).to.equal('x');
      expect(key.shiftKey).to.be.false;
      expect(key.ctrlKey).to.be.true;
      expect(key.altKey).to.be.false;
      expect(key.metaKey).to.be.true;
    });

    it('returns for Ctrl+Shift+x', () => {
      let key = keys.fromMapKey('<C-S-x>');
      expect(key.key).to.equal('X');
      expect(key.shiftKey).to.be.true;
      expect(key.ctrlKey).to.be.true;
      expect(key.altKey).to.be.false;
      expect(key.metaKey).to.be.false;
    });

    it('returns for Shift+Esc', () => {
      let key = keys.fromMapKey('<S-Esc>');
      expect(key.key).to.equal('Esc');
      expect(key.shiftKey).to.be.true;
      expect(key.ctrlKey).to.be.false;
      expect(key.altKey).to.be.false;
      expect(key.metaKey).to.be.false;
    });

    it('returns for Ctrl+Esc', () => {
      let key = keys.fromMapKey('<C-Esc>');
      expect(key.key).to.equal('Esc');
      expect(key.shiftKey).to.be.false;
      expect(key.ctrlKey).to.be.true;
      expect(key.altKey).to.be.false;
      expect(key.metaKey).to.be.false;
    });

    it('returns for Ctrl+Esc', () => {
      let key = keys.fromMapKey('<C-Space>');
      expect(key.key).to.equal('Space');
      expect(key.shiftKey).to.be.false;
      expect(key.ctrlKey).to.be.true;
      expect(key.altKey).to.be.false;
      expect(key.metaKey).to.be.false;
    });
  });

  describe('equals', () => {
    expect(keys.equals(
      { key: 'x', ctrlKey: true, },
      { key: 'x', ctrlKey: true, },
    )).to.be.true;

    expect(keys.equals(
      { key: 'X', shiftKey: true, },
      { key: 'x', ctrlKey: true, },
    )).to.be.false;
  });
});
