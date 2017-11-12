import { expect } from 'chai';
import * as keys from 'shared/utils/keys';

describe("keys util", () => {
  describe('fromKeyboardEvent', () => {
    it('returns from keyboard input Ctrl+X', () => {
      let k = keys.fromKeyboardEvent({
        key: 'x', shiftKey: false, ctrlKey: true, altKey: false, metaKey: true
      });
      expect(k.key).to.equal('x');
      expect(k.shiftKey).to.be.false;
      expect(k.ctrlKey).to.be.true;
      expect(k.altKey).to.be.false;
      expect(k.metaKey).to.be.true;
    });

    it('returns from keyboard input Shift+Esc', () => {
      let k = keys.fromKeyboardEvent({
        key: 'Escape', shiftKey: true, ctrlKey: false, altKey: false, metaKey: true
      });
      expect(k.key).to.equal('Esc');
      expect(k.shiftKey).to.be.true;
      expect(k.ctrlKey).to.be.false;
      expect(k.altKey).to.be.false;
      expect(k.metaKey).to.be.true;
    });

    it('returns from keyboard input Ctrl+$', () => {
      // $ required shift pressing on most keyboards
      let k = keys.fromKeyboardEvent({
        key: '$', shiftKey: true, ctrlKey: true, altKey: false, metaKey: false
      });
      expect(k.key).to.equal('$');
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
  });

  describe('fromMapKeys', () => {
    it('returns mapped keys for Shift+Esc', () => {
      let keyArray = keys.fromMapKeys('<S-Esc>');
      expect(keyArray).to.have.lengthOf(1);
      expect(keyArray[0].key).to.equal('Esc');
      expect(keyArray[0].shiftKey).to.be.true;
    });

    it('returns mapped keys for a<C-B><A-C>d<M-e>', () => {
      let keyArray = keys.fromMapKeys('a<C-B><A-C>d<M-e>');
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

  describe('equals', () => {
    expect(keys.equals({
      key: 'x',
      ctrlKey: true,
    }, {
      key: 'x',
      ctrlKey: true,
    })).to.be.true;

    expect(keys.equals({
      key: 'X',
      shiftKey: true,
    }, {
      key: 'x',
      ctrlKey: true,
    })).to.be.false;
  });
});
