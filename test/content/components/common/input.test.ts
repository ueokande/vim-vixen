import InputComponent from 'content/components/common/input';

describe('InputComponent', () => {
  it('register callbacks', () => {
    let component = new InputComponent(window.document);
    let key = { key: 'a', ctrlKey: true, shiftKey: false, altKey: false, metaKey: false };
    component.onKey((key) => {
      expect(key).to.deep.equal(key);
    });
    component.onKeyDown(key);
  });

  it('invoke callback once', () => {
    let component = new InputComponent(window.document);
    let a = 0, b = 0;
    component.onKey((key) => {
      if (key.key == 'a') {
        ++a;
      } else {
        key.key == 'b'
        ++b;
      }
    });

    let elem = document.body;
    component.onKeyDown({ key: 'a', target: elem });
    component.onKeyDown({ key: 'b', target: elem });
    component.onKeyPress({ key: 'a', target: elem });
    component.onKeyUp({ key: 'a', target: elem });
    component.onKeyPress({ key: 'b', target: elem });
    component.onKeyUp({ key: 'b', target: elem });

    expect(a).is.equals(1);
    expect(b).is.equals(1);
  })

  it('does not invoke only meta keys', () => {
    let component = new InputComponent(window.document);
    component.onKey((key) => {
      expect.fail();
    });
    component.onKeyDown({ key: 'Shift' });
    component.onKeyDown({ key: 'Control' });
    component.onKeyDown({ key: 'Alt' });
    component.onKeyDown({ key: 'OS' });
  })

  it('ignores events from input elements', () => {
    ['input', 'textarea', 'select'].forEach((name) => {
      let target = window.document.createElement(name);
      let component = new InputComponent(target);
      component.onKey((key) => {
        expect.fail();
      });
      component.onKeyDown({ key: 'x', target });
    });
  });

  it('ignores events from contenteditable  elements', () => {
    let target = window.document.createElement('div');
    let component = new InputComponent(target);
    component.onKey((key) => {
      expect.fail();
    });

    target.setAttribute('contenteditable', '');
    component.onKeyDown({ key: 'x', target });

    target.setAttribute('contenteditable', 'true');
    component.onKeyDown({ key: 'x', target });
  })
});
