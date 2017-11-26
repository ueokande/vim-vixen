import { expect } from 'chai';
import { h, render } from 'preact';
import SearchForm from 'settings/components/form/search-form'

describe("settings/form/SearchForm", () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('render', () => {
    it('renders SearchForm', () => {
      render(<SearchForm value={{
        default: 'google',
        engines: [['google', 'google.com'], ['yahoo', 'yahoo.com']],
      }} />, document.body);

      let names = document.querySelectorAll('input[name=name]');
      expect(names).to.have.lengthOf(2);
      expect(names[0].value).to.equal('google');
      expect(names[1].value).to.equal('yahoo');

      let urls = document.querySelectorAll('input[name=url]');
      expect(urls).to.have.lengthOf(2);
      expect(urls[0].value).to.equal('google.com');
      expect(urls[1].value).to.equal('yahoo.com');
    });

    it('renders blank value', () => {
      render(<SearchForm />, document.body);

      let names = document.querySelectorAll('input[name=name]');
      let urls = document.querySelectorAll('input[name=url]');
      expect(names).to.have.lengthOf(0);
      expect(urls).to.have.lengthOf(0);
    });

    it('renders blank engines', () => {
      render(<SearchForm value={{ default: 'google' }} />, document.body);

      let names = document.querySelectorAll('input[name=name]');
      let urls = document.querySelectorAll('input[name=url]');
      expect(names).to.have.lengthOf(0);
      expect(urls).to.have.lengthOf(0);
    });
  });

  describe('onChange event', () => {
    it('invokes onChange event on edit', (done) => {
      render(<SearchForm
        value={{
          default: 'google',
          engines: [['google', 'google.com'], ['yahoo', 'yahoo.com']]
        }}
        onChange={value => {
          expect(value.default).to.equal('louvre');
          expect(value.engines).to.have.lengthOf(2)
            .and.have.deep.members([['louvre', 'google.com'], ['yahoo', 'yahoo.com']])

          done();
        }} />, document.body);

      let radio = document.querySelectorAll('input[type=radio]');
      radio.checked = true;

      let name = document.querySelector('input[name=name]');
      name.value = 'louvre';
      name.dispatchEvent(new Event('change'))
    });

    it('invokes onChange event on delete', (done) => {
      render(<SearchForm value={{
          default: 'yahoo',
          engines: [['louvre', 'google.com'], ['yahoo', 'yahoo.com']]
        }}
        onChange={value => {
          expect(value.default).to.equal('yahoo');
          expect(value.engines).to.have.lengthOf(1)
            .and.have.deep.members([['yahoo', 'yahoo.com']])

          done();
        }} />, document.body);

      let button = document.querySelector('input[type=button]');
      button.click();
    });

    it('invokes onChange event on add', (done) => {
      render(<SearchForm value={{
          default: 'yahoo',
          engines: [['google', 'google.com']]
        }}
        onChange={value => {
          expect(value.default).to.equal('yahoo');
          expect(value.engines).to.have.lengthOf(2)
            .and.have.deep.members([['google', 'google.com'], ['', '']])

          done();
        }} />, document.body);

      let button = document.querySelector('input[type=button].ui-add-button');
      button.click();
    });
  });
});
