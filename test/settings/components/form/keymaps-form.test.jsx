import { expect } from 'chai';
import { h, render } from 'preact';
import KeymapsForm from 'settings/components/form/keymaps-form'

describe("settings/form/KeymapsForm", () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('render', () => {
    it('renders KeymapsForm', () => {
      render(<KeymapsForm value={{
        'scroll.vertically?{"count":1}': 'j',
        'scroll.vertically?{"count":-1}': 'k',
      }} />, document.body);

      let inputj = document.getElementById('scroll.vertically?{"count":1}');
      let inputk = document.getElementById('scroll.vertically?{"count":-1}');

      expect(inputj.value).to.equal('j');
      expect(inputk.value).to.equal('k');
    });

    it('renders blank value', () => {
      render(<KeymapsForm />, document.body);

      let inputj = document.getElementById('scroll.vertically?{"count":1}');
      let inputk = document.getElementById('scroll.vertically?{"count":-1}');

      expect(inputj.value).to.be.empty;
      expect(inputk.value).to.be.empty;
    });
  });

  describe('onChange event', () => {
    it('invokes onChange event on edit', (done) => {
      render(<KeymapsForm
        value={{
          'scroll.vertically?{"count":1}': 'j',
          'scroll.vertically?{"count":-1}': 'k',
        }}
        onChange={value => {
          expect(value['scroll.vertically?{"count":1}']).to.equal('jjj');

          done();
        }} />, document.body);

      let input = document.getElementById('scroll.vertically?{"count":1}');
      input.value = 'jjj';
      input.dispatchEvent(new Event('change'))
    });
  });
});
