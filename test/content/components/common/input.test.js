import InputComponent from 'content/components/common/input';
import { expect } from "chai";

describe('InputComponent', () => {
  it('register callbacks', () => {
    let component = new InputComponent(window.document);
    component.onKey((key) => {
      expect(key).is.equals('a');
    });
    component.onKeyDown({ key: 'a' });
  });

  it('invoke callback once', () => {
    let component = new InputComponent(window.document);
    let a = 0, b = 0;
    component.onKey((key) => {
      if (key == 'a') {
        ++a;
      } else {
        key == 'b'
        ++b;
      }
    });
    component.onKeyDown({ key: 'a' });
    component.onKeyDown({ key: 'b' });
    component.onKeyPress({ key: 'a' });
    component.onKeyUp({ key: 'a' });
    component.onKeyPress({ key: 'b' });
    component.onKeyUp({ key: 'b' });

    expect(a).is.equals(1);
    expect(b).is.equals(1);
  })

  it('add prefix when ctrl pressed', () => {
    let component = new InputComponent(window.document);
    component.onKey((key) => {
      expect(key).is.equals('<C-A>');
    });
    component.onKeyDown({ key: 'a', ctrlKey: true });
  })

  it('press X', () => {
    let component = new InputComponent(window.document);
    component.onKey((key) => {
      expect(key).is.equals('X');
    });
    component.onKeyDown({ key: 'X', shiftKey: true });
  })

  it('press <Shift> + <Esc>', () => {
    let component = new InputComponent(window.document);
    component.onKey((key) => {
      expect(key).is.equals('<S-Esc>');
    });
    component.onKeyDown({ key: 'Escape', shiftKey: true });
  })

  it('press <Ctrl> + <Esc>', () => {
    let component = new InputComponent(window.document);
    component.onKey((key) => {
      expect(key).is.equals('<C-Esc>');
    });
    component.onKeyDown({ key: 'Escape', ctrlKey: true });
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
