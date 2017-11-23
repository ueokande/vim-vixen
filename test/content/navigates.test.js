import { expect } from 'chai';
import * as navigates from 'content/navigates';

const testRel = (done, rel, html) => {
  const method = rel === 'prev' ? 'linkPrev' : 'linkNext';
  document.body.innerHTML = html;
  navigates[method](window);
  setTimeout(() => {
    expect(document.location.hash).to.equal(`#${rel}`);
    done();
  }, 0);
};

const testPrev = html => done => testRel(done, 'prev', html);
const testNext = html => done => testRel(done, 'next', html);

describe('navigates module', () => {
  describe('#linkPrev', () => {
    it('navigates to <link> elements whose rel attribute is "prev"', testPrev(
      '<link rel="prev" href="#prev" />'
    ));

    it('navigates to <link> elements whose rel attribute starts with "prev"', testPrev(
      '<link rel="prev bar" href="#prev" />'
    ));

    it('navigates to <link> elements whose rel attribute ends with "prev"', testPrev(
      '<link rel="foo prev" href="#prev" />'
    ));

    it('navigates to <link> elements whose rel attribute contains "prev"', testPrev(
      '<link rel="foo prev bar" href="#prev" />'
    ));

    it('navigates to <a> elements whose rel attribute is "prev"', testPrev(
      '<a rel="prev" href="#prev">click me</a>'
    ));

    it('navigates to <a> elements whose rel attribute starts with "prev"', testPrev(
      '<a rel="prev bar" href="#prev">click me</a>'
    ));

    it('navigates to <a> elements whose rel attribute ends with "prev"', testPrev(
      '<a rel="foo prev" href="#prev">click me</a>'
    ));

    it('navigates to <a> elements whose rel attribute contains "prev"', testPrev(
      '<a rel="foo prev bar" href="#prev">click me</a>'
    ));

    it('navigates to <a> elements whose text matches "prev"', testPrev(
      '<a href="#dummy">preview</a><a href="#prev">go to prev</a>'
    ));

    it('navigates to <a> elements whose text matches "previous"', testPrev(
      '<a href="#dummy">previously</a><a href="#prev">previous page</a>'
    ));

    it('navigates to <a> elements whose decoded text matches "<<"', testPrev(
      '<a href="#dummy">click me</a><a href="#prev">&lt;&lt;</a>'
    ));

    it('navigates to matching <a> elements by clicking', testPrev(
      `<a rel="prev" href="#dummy" onclick="return location = '#prev', false">go to prev</a>`
    ));

    it('prefers link[rel~=prev] to a[rel~=prev]', testPrev(
      '<a rel="prev" href="#dummy">click me</a><link rel="prev" href="#prev" />'
    ));

    it('prefers a[rel~=prev] to a::text(pattern)', testPrev(
      '<a href="#dummy">go to prev</a><a rel="prev" href="#prev">click me</a>'
    ));
  });

  describe('#linkNext', () => {
    it('navigates to <link> elements whose rel attribute is "next"', testNext(
      '<link rel="next" href="#next" />'
    ));

    it('navigates to <link> elements whose rel attribute starts with "next"', testNext(
      '<link rel="next bar" href="#next" />'
    ));

    it('navigates to <link> elements whose rel attribute ends with "next"', testNext(
      '<link rel="foo next" href="#next" />'
    ));

    it('navigates to <link> elements whose rel attribute contains "next"', testNext(
      '<link rel="foo next bar" href="#next" />'
    ));

    it('navigates to <a> elements whose rel attribute is "next"', testNext(
      '<a rel="next" href="#next">click me</a>'
    ));

    it('navigates to <a> elements whose rel attribute starts with "next"', testNext(
      '<a rel="next bar" href="#next">click me</a>'
    ));

    it('navigates to <a> elements whose rel attribute ends with "next"', testNext(
      '<a rel="foo next" href="#next">click me</a>'
    ));

    it('navigates to <a> elements whose rel attribute contains "next"', testNext(
      '<a rel="foo next bar" href="#next">click me</a>'
    ));

    it('navigates to <a> elements whose text matches "next"', testNext(
      '<a href="#dummy">inextricable</a><a href="#next">go to next</a>'
    ));

    it('navigates to <a> elements whose decoded text matches ">>"', testNext(
      '<a href="#dummy">click me</a><a href="#next">&gt;&gt;</a>'
    ));

    it('navigates to matching <a> elements by clicking', testNext(
      `<a rel="next" href="#dummy" onclick="return location = '#next', false">go to next</a>`
    ));

    it('prefers link[rel~=next] to a[rel~=next]', testNext(
      '<a rel="next" href="#dummy">click me</a><link rel="next" href="#next" />'
    ));

    it('prefers a[rel~=next] to a::text(pattern)', testNext(
      '<a href="#dummy">next page</a><a rel="next" href="#next">click me</a>'
    ));
  });

  describe('#parent', () => {
    // NOTE: not able to test location
    it('removes hash', () => {
      window.location.hash = '#section-1';
      navigates.parent(window);
      expect(document.location.hash).to.be.empty;
    });
  });
});
