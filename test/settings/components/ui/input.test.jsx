import { expect } from 'chai';
import { h, render } from 'preact';
import Input from 'settings/components/ui/input'

describe("settings/ui/Input", () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  context("type=text", () => {
    it('renders text input', () => {
      render(<Input type='text' name='myname' label='myfield' value='myvalue'/>, document.body)

      let label = document.querySelector('label');
      let input = document.querySelector('input');
      expect(label.textContent).to.contain('myfield');
      expect(input.type).to.contain('text');
      expect(input.name).to.contain('myname');
      expect(input.value).to.contain('myvalue');
    });

    it('invoke onChange', (done) => {
      render(<Input type='text' name='myname' label='myfield' value='myvalue' onChange={(e) => {
        expect(e.target.value).to.equal('newvalue');
        done();
      }}/>, document.body);

      let input = document.querySelector('input');
      input.value = 'newvalue';
      input.dispatchEvent(new Event('change'))
    });
  });

  context("type=radio", () => {
    it('renders radio button', () => {
      render(<Input type='radio' name='myname' label='myfield' value='myvalue'/>, document.body)

      let label = document.querySelector('label');
      let input = document.querySelector('input');
      expect(label.textContent).to.contain('myfield');
      expect(input.type).to.contain('radio');
      expect(input.name).to.contain('myname');
      expect(input.value).to.contain('myvalue');
    });

    it('invoke onChange', (done) => {
      render(<Input type='text' name='radio' label='myfield' value='myvalue' onChange={(e) => {
        expect(e.target.checked).to.be.true;
        done();
      }}/>, document.body);

      let input = document.querySelector('input');
      input.checked = true;
      input.dispatchEvent(new Event('change'))
    });
  });

  context("type=textarea", () => {
    it('renders textarea button', () => {
      render(<Input type='textarea' name='myname' label='myfield' value='myvalue' error='myerror' />, document.body)

      let label = document.querySelector('label');
      let textarea = document.querySelector('textarea');
      let error = document.querySelector('.settings-ui-input-error');
      expect(label.textContent).to.contain('myfield');
      expect(textarea.nodeName).to.contain('TEXTAREA');
      expect(textarea.name).to.contain('myname');
      expect(textarea.value).to.contain('myvalue');
      expect(error.textContent).to.contain('myerror');
    });

    it('invoke onChange', (done) => {
      render(<Input type='textarea' name='myname' label='myfield' value='myvalue' onChange={(e) => {
        expect(e.target.value).to.equal('newvalue');
        done();
      }}/>, document.body);

      let input = document.querySelector('textarea');
      input.value = 'newvalue'
      input.dispatchEvent(new Event('change'))
    });
  });
});
