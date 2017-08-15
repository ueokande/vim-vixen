import { expect } from "chai";
import { identifyKey, identifyKeys, hasPrefix } from '../../src/background/keys';

describe('keys', () => {
  describe('#identifyKey', () => {
    it('return true if key matched', () => {
      expect(identifyKey(
        { code: 100 },
        { code: 100 })).to.be.true;
      expect(identifyKey(
        { code: 100, shift: true, ctrl: true },
        { code: 100, shift: true, ctrl: true })).to.be.true;
      expect(identifyKey(
        { code: 100, shift: false, ctrl: false },
        { code: 100 })).to.be.true;
    });

    it('return false if key not matched', () => {
      expect(identifyKey(
        { code: 100 },
        { code: 101 })).to.be.false;
      expect(identifyKey(
        { code: 100, shift: true, ctrl: true },
        { code: 100, shift: true })).to.be.false;
    });
  });

  describe('#identifyKeys', () => {
    it ('return true if keys matched', () => {
      let keys = [{ code: 100 }, { code: 101, ctrl: false}];
      let prefix = [{ code: 100, ctrl: false }, { code: 101 }];
      expect(hasPrefix(keys, prefix)).to.be.true;
    });

    it ('return false if keys matched', () => {
      let keys = [{ code: 100 }, { code: 101, ctrl: true }];
      let prefix = [{ code: 100 }, { code: 101 }];
      expect(hasPrefix(keys, prefix)).to.be.false;
    });
  });

  describe('#hasPrefix', () => {
    it ('return true if prefix matched', () => {
      let keys = [{ code: 100 }, { code: 101 }, { code: 102 }];
      let prefix = [{ code: 100 }, { code: 101 }];
      expect(hasPrefix(keys, prefix)).to.be.true;
    });

    it ('return false if prefix not matched', () => {
      let keys = [{ code: 100 }, { code: 101 }, { code: 102 }];
      let prefix = [{ code: 102 }];
      expect(hasPrefix(keys, prefix)).to.be.false;
    });
  });
});
