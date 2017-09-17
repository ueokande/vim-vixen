import { expect } from "chai";
import * as navigates from '../../src/content/navigates';

describe('navigates module', () => {
  beforeEach(() => {
  });

  describe('#linkPrev', () => {
    it('clicks prev link by text content', (done) => {
      document.body.innerHTML = '<a href="#dummy">xprevx</a>  <a href="#prev">go to prev</a>';
      navigates.linkPrev(window);
      setTimeout(() => {
        expect(document.location.hash).to.equal('#prev');
        done();
      }, 0);
    });

    it('clicks a[rel=prev] element preferentially', (done) => {
      document.body.innerHTML = '<a href="#dummy">prev</a>  <a rel="prev" href="#prev">rel</a>';
      navigates.linkPrev(window);
      setTimeout(() => {
        expect(document.location.hash).to.equal('#prev');
        done();
      }, 0);
    });
  });


  describe('#linkNext', () => {
    it('clicks next link by text content', (done) => {
      document.body.innerHTML = '<a href="#dummy">xnextx</a>  <a href="#next">go to next</a>';
      navigates.linkNext(window);
      setTimeout(() => {
        expect(document.location.hash).to.equal('#next');
        done();
      }, 0);
    });

    it('clicks a[rel=next] element preferentially', (done) => {
      document.body.innerHTML = '<a href="#dummy">next</a>  <a rel="next" href="#next">rel</a>';
      navigates.linkNext(window);
      setTimeout(() => {
        expect(document.location.hash).to.equal('#next');
        done();
      }, 0);
    });
  });
});


