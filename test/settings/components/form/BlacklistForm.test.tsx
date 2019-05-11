import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestRenderer from 'react-test-renderer';
import ReactTestUtils from 'react-dom/test-utils';
import BlacklistForm from 'settings/components/form/BlacklistForm'

describe("settings/form/BlacklistForm", () => {
  describe('render', () => {
    it('renders BlacklistForm', () => {
      let root = ReactTestRenderer.create(
        <BlacklistForm value={['*.slack.com', 'www.google.com/maps']} />,
      ).root;

      let children = root.children[0].children;
      expect(children).to.have.lengthOf(3);
      expect(children[0].children[0].props.value).to.equal('*.slack.com');
      expect(children[1].children[0].props.value).to.equal('www.google.com/maps');
      expect(children[2].props.name).to.equal('add');
    });

    it('renders blank value', () => {
      let root = ReactTestRenderer.create(<BlacklistForm />).root;

      let children = root.children[0].children;
      expect(children).to.have.lengthOf(1);
      expect(children[0].props.name).to.equal('add');
    });
  });

  describe('onChange', () => {
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
        ReactDOM.render(<BlacklistForm
          value={['*.slack.com', 'www.google.com/maps*']}
          onChange={value => {
            expect(value).to.have.lengthOf(2);
            expect(value).to.have.members(['gitter.im', 'www.google.com/maps*']);
            done();
          }}
        />, container)
      });

      let input = document.querySelectorAll('input[type=text]')[0];
      input.value = 'gitter.im';
      ReactTestUtils.Simulate.change(input);
    });

    it('invokes onChange event on delete', (done) => {
      ReactTestUtils.act(() => {
        ReactDOM.render(<BlacklistForm
          value={['*.slack.com', 'www.google.com/maps*']}
          onChange={value => {
            expect(value).to.have.lengthOf(1);
            expect(value).to.have.members(['www.google.com/maps*']);
            done();
          }}
        />, container)
      });

      let button = document.querySelectorAll('input[type=button]')[0];
      ReactTestUtils.Simulate.click(button);
    });

    it('invokes onChange event on add', (done) => {
      ReactTestUtils.act(() => {
        ReactDOM.render(<BlacklistForm
          value={['*.slack.com']}
          onChange={value => {
            expect(value).to.have.lengthOf(2);
            expect(value).to.have.members(['*.slack.com', '']);
            done();
          }}
        />, container);
      });

      let button = document.querySelector('input[type=button].ui-add-button');
      ReactTestUtils.Simulate.click(button);
    });
  });
});
