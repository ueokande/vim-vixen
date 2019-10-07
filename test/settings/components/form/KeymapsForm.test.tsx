import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestRenderer from 'react-test-renderer';
import ReactTestUtils from 'react-dom/test-utils';
import KeymapsForm from '../../../../src/settings/components/form/KeymapsForm'
import { FormKeymaps } from 'shared/SettingData';
import { expect } from 'chai';

describe("settings/form/KeymapsForm", () => {
  describe('render', () => {
    it('renders keymap fields', () => {
      let root = ReactTestRenderer.create(<KeymapsForm value={FormKeymaps.fromJSON({
        'scroll.vertically?{"count":1}': 'j',
        'scroll.vertically?{"count":-1}': 'k',
      })} />).root

      let inputj = root.findByProps({ id: 'scroll.vertically?{"count":1}' });
      let inputk = root.findByProps({ id: 'scroll.vertically?{"count":-1}' });

      expect(inputj.props.value).to.equal('j');
      expect(inputk.props.value).to.equal('k');
    });

    it('renders blank value', () => {
      let root = ReactTestRenderer.create(<KeymapsForm />).root;

      let inputj = root.findByProps({ id: 'scroll.vertically?{"count":1}' });
      let inputk = root.findByProps({ id: 'scroll.vertically?{"count":-1}' });

      expect(inputj.props.value).to.be.empty;
      expect(inputk.props.value).to.be.empty;
    });
  });

  describe('onChange event', () => {
    let container;

    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.removeChild(container);
      container = null;
    });

    it('invokes onChange event on edit', (done) => {
      ReactTestUtils.act(() => {
        ReactDOM.render(<KeymapsForm
          value={FormKeymaps.fromJSON({
            'scroll.vertically?{"count":1}': 'j',
            'scroll.vertically?{"count":-1}': 'k',
          })}
          onChange={value => {
            expect(value.toJSON()['scroll.vertically?{"count":1}']).to.equal('jjj');
            done();
          }} />, container);
      });

      let input = document.getElementById('scroll.vertically?{"count":1}');
      input.value = 'jjj';
      ReactTestUtils.Simulate.change(input);
    });
  });
});
