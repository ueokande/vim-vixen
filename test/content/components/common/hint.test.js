import { expect } from "chai";
import Hint from 'content/components/common/hint';

describe('Hint class', () => {
  beforeEach(() => {
    document.body.innerHTML = __html__['test/content/components/common/hint.html'];
  });

  describe('#constructor', () => {
    it('creates a hint element with tag name', () => {
      let link = document.getElementById('test-link');
      let hint = new Hint(link, 'abc');
      expect(hint.element.textContent.trim()).to.be.equal('abc');
    });

    it('throws an exception when non-element given', () => {
      expect(() => new Hint(window, 'abc')).to.throw(TypeError);
    });
  });

  describe('#show', () => {
    it('shows an element', () => {
      let link = document.getElementById('test-link');
      let hint = new Hint(link, 'abc');
      hint.hide();
      hint.show();

      expect(hint.element.style.display).to.not.equal('none');
    });
  });

  describe('#hide', () => {
    it('hides an element', () => {
      let link = document.getElementById('test-link');
      let hint = new Hint(link, 'abc');
      hint.hide();

      expect(hint.element.style.display).to.equal('none');
    });
  });

  describe('#remove', () => {
    it('removes an element', () => {
      let link = document.getElementById('test-link');
      let hint = new Hint(link, 'abc');

      expect(hint.element.parentElement).to.not.be.null;
      hint.remove();
      expect(hint.element.parentElement).to.be.null;
    });
  });

  describe('#activate', () => {
    // TODO test activations
  });
});


