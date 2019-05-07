import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestRenderer from 'react-test-renderer';
import ReactTestUtils from 'react-dom/test-utils';
import SearchForm from 'settings/components/form/SearchForm'
import { FormSearch } from 'shared/SettingData';

describe("settings/form/SearchForm", () => {
  describe('render', () => {
    it('renders SearchForm', () => {
      let root = ReactTestRenderer.create(<SearchForm value={FormSearch.valueOf({
        default: 'google',
        engines: [['google', 'google.com'], ['yahoo', 'yahoo.com']],
      })} />).root;

      let names = root.findAllByProps({ name: 'name' });
      expect(names).to.have.lengthOf(2);
      expect(names[0].props.value).to.equal('google');
      expect(names[1].props.value).to.equal('yahoo');

      let urls = root.findAllByProps({ name: 'url' });
      expect(urls).to.have.lengthOf(2);
      expect(urls[0].props.value).to.equal('google.com');
      expect(urls[1].props.value).to.equal('yahoo.com');
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
        ReactDOM.render(<SearchForm
          value={FormSearch.valueOf({
            default: 'google',
              engines: [['google', 'google.com'], ['yahoo', 'yahoo.com']]
          })}
          onChange={value => {
            let json = value.toJSON();
            expect(json.default).to.equal('louvre');
            expect(json.engines).to.have.lengthOf(2)
            expect(json.engines).to.have.deep.members(
              [['louvre', 'google.com'], ['yahoo', 'yahoo.com']]
            );
            done();
          }} />, container);
      });

      let radio = document.querySelectorAll('input[type=radio]');
      radio.checked = true;

      let name = document.querySelector('input[name=name]');
      name.value = 'louvre';

      ReactTestUtils.Simulate.change(name);
    });

    it('invokes onChange event on delete', (done) => {
      ReactTestUtils.act(() => {
        ReactDOM.render(<SearchForm value={FormSearch.valueOf({
            default: 'yahoo',
            engines: [['louvre', 'google.com'], ['yahoo', 'yahoo.com']]
          })}
          onChange={value => {
            let json = value.toJSON();
            expect(json.default).to.equal('yahoo');
            expect(json.engines).to.have.lengthOf(1)
            expect(json.engines).to.have.deep.members(
              [['yahoo', 'yahoo.com']]
            );
            done();
          }} />, container);
      });

      let button = document.querySelector('input[type=button]');
      ReactTestUtils.Simulate.click(button);
    });

    it('invokes onChange event on add', (done) => {
      ReactTestUtils.act(() => {
        ReactDOM.render(<SearchForm value={FormSearch.valueOf({
          default: 'yahoo',
            engines: [['google', 'google.com']]
          })}
          onChange={value => {
            let json = value.toJSON();
            expect(json.default).to.equal('yahoo');
            expect(json.engines).to.have.lengthOf(2)
            expect(json.engines).to.have.deep.members(
              [['google', 'google.com'], ['', '']],
            );
            done();
          }} />, container);
      });

      let button = document.querySelector('input[type=button].ui-add-button');
      ReactTestUtils.Simulate.click(button);
    });
  });
});
