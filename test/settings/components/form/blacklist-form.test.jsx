import { expect } from 'chai';
import { h, render } from 'preact';
import BlacklistForm from 'settings/components/form/blacklist-form'

describe("settings/form/BlacklistForm", () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('render', () => {
    it('renders BlacklistForm', () => {
      render(<BlacklistForm value={['*.slack.com', 'www.google.com/maps']} />, document.body);

      let inputs = document.querySelectorAll('input[type=text]');
      expect(inputs).to.have.lengthOf(2);
      expect(inputs[0].value).to.equal('*.slack.com');
      expect(inputs[1].value).to.equal('www.google.com/maps');
    });

    it('renders blank value', () => {
      render(<BlacklistForm />, document.body);

      let inputs = document.querySelectorAll('input[type=text]');
      expect(inputs).to.be.empty;
    });

    it('renders blank value', () => {
      render(<BlacklistForm />, document.body);

      let inputs = document.querySelectorAll('input[type=text]');
      expect(inputs).to.be.empty;
    });
  });

  describe('onChange', () => {
    it('invokes onChange event on edit', (done) => {
      render(<BlacklistForm
        value={['*.slack.com', 'www.google.com/maps*']}
        onChange={value => {
          expect(value).to.have.lengthOf(2)
            .and.have.members(['gitter.im', 'www.google.com/maps*']);

          done();
        }}
      />, document.body);

      let input = document.querySelectorAll('input[type=text]')[0];
      input.value = 'gitter.im';
      input.dispatchEvent(new Event('change'))
    });

    it('invokes onChange event on delete', (done) => {
      render(<BlacklistForm
        value={['*.slack.com', 'www.google.com/maps*']}
        onChange={value => {
          expect(value).to.have.lengthOf(1)
            .and.have.members(['www.google.com/maps*']);

          done();
        }}
      />, document.body);

      let button = document.querySelectorAll('input[type=button]')[0];
      button.click();
    });

    it('invokes onChange event on add', (done) => {
      render(<BlacklistForm
        value={['*.slack.com']}
        onChange={value => {
          expect(value).to.have.lengthOf(2)
            .and.have.members(['*.slack.com', '']);

          done();
        }}
      />, document.body);

      let button = document.querySelector('input[type=button].ui-add-button');
      button.click();
    });
  });
});
