import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import Input from 'settings/components/ui/Input'

describe("settings/ui/Input", () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  context("type=text", () => {
    it('renders text input', () => {
      ReactTestUtils.act(() => {
        ReactDOM.render(
          <Input type='text' name='myname' label='myfield' value='myvalue'/>,
          container);
      });

      let label = document.querySelector('label');
      let input = document.querySelector('input');
      expect(label.textContent).to.contain('myfield');
      expect(input.type).to.contain('text');
      expect(input.name).to.contain('myname');
      expect(input.value).to.contain('myvalue');
    });

    it('invoke onChange', (done) => {
      ReactTestUtils.act(() => {
        ReactDOM.render(<Input type='text' name='myname' label='myfield' value='myvalue' onChange={(e) => {
          expect(e.target.value).to.equal('newvalue');
          done();
        }}/>, container);
      });

      let input = document.querySelector('input');
      input.value = 'newvalue';
      ReactTestUtils.Simulate.change(input);
    });
  });

  context("type=radio", () => {
    it('renders radio button', () => {
      ReactTestUtils.act(() => {
        ReactDOM.render(
          <Input type='radio' name='myname' label='myfield' value='myvalue'/>,
          container);
      });

      let label = document.querySelector('label');
      let input = document.querySelector('input');
      expect(label.textContent).to.contain('myfield');
      expect(input.type).to.contain('radio');
      expect(input.name).to.contain('myname');
      expect(input.value).to.contain('myvalue');
    });

    it('invoke onChange', (done) => {
      ReactTestUtils.act(() => {
        ReactDOM.render(<Input type='text' name='radio' label='myfield' value='myvalue' onChange={(e) => {
          expect(e.target.checked).to.be.true;
          done();
        }}/>,
        container);
      });

      let input = document.querySelector('input');
      input.checked = true;
      ReactTestUtils.Simulate.change(input);
    });
  });

  context("type=textarea", () => {
    it('renders textarea button', () => {
      ReactTestUtils.act(() => {
        ReactDOM.render(
          <Input type='textarea' name='myname' label='myfield' value='myvalue' error='myerror' />,
          container);
      });

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
      ReactTestUtils.act(() => {
        ReactDOM.render(<Input type='textarea' name='myname' label='myfield' value='myvalue' onChange={(e) => {
          expect(e.target.value).to.equal('newvalue');
          done();
        }}/>, container);
      });

      let input = document.querySelector('textarea');
      input.value = 'newvalue'
      ReactTestUtils.Simulate.change(input);
    });
  });
});
