import { expect } from "chai";
import { validate } from '../../../src/shared/validators/setting';

describe("setting validator", () => {
  describe("unknown top keys", () => {
    it('throws an error for unknown settings', () => {
      let settings = { keymaps: {}, poison: 123 };
      let fn = validate.bind(undefined, settings)
      expect(fn).to.throw(Error, 'poison');
    })
  });

  describe("keymaps settings", () => {
    it('throws an error for unknown operation', () => {
      let settings = {
        keymaps: {
          a: { 'type': 'scroll.home' },
          b: { 'type': 'poison.dressing' },
        }
      };
      let fn = validate.bind(undefined, settings)
      expect(fn).to.throw(Error, 'poison.dressing');
    });
  });
});
