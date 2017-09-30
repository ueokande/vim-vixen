import { expect } from "chai";
import Completion from '../../src/pages/completion';

describe('Completion class', () => {
  describe('#constructor', () => {
    it('creates new object by iterable items', () => {
      new Completion([1,2,3,4,5]);
      new Completion([]);
      new Completion('hello');
      new Completion('');
    });

    it('creates new object by iterable items', () => {
      expect(() => new Completion({ key: 'value' })).to.throw(TypeError);
      expect(() => new Completion(12345)).to.throw(TypeError);
    });
  });

  describe('#next', () => {
    it('complete next items', () => {
      let completion = new Completion([3, 4, 5]);
      expect(completion.next()).to.equal(3);
      expect(completion.next()).to.equal(4);
      expect(completion.next()).to.equal(5);
      expect(completion.next()).to.equal(3);
    });

    it('returns null when empty completions', () => {
      let completion = new Completion([]);
      expect(completion.next()).to.be.null;
    });
  });

  describe('#prev', () => {
    it('complete prev items', () => {
      let completion = new Completion([3, 4, 5]);
      expect(completion.prev()).to.equal(5);
      expect(completion.prev()).to.equal(4);
      expect(completion.prev()).to.equal(3);
      expect(completion.prev()).to.equal(5);
    });

    it('returns null when empty completions', () => {
      let completion = new Completion([]);
      expect(completion.prev()).to.be.null;
    });
  });
});
