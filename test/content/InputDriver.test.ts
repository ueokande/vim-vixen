import InputDriver from '../../src/content/InputDriver';
import { expect } from 'chai';
import { Key } from '../../src/shared/utils/keys';

describe('InputDriver', () => {
  let target: HTMLElement;
  let driver: InputDriver;

  beforeEach(() => {
    target = document.createElement('div');
    document.body.appendChild(target);
    driver = new InputDriver(target);
  });

  afterEach(() => {
    target.remove();
    target = null;
    driver = null;
  });

  it('register callbacks', (done) => {
    driver.onKey((key: Key): boolean => {
      expect(key.key).to.equal('a');
      expect(key.ctrlKey).to.be.true;
      expect(key.shiftKey).to.be.false;
      expect(key.altKey).to.be.false;
      expect(key.metaKey).to.be.false;
      done();
      return true;
    });

    target.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'a',
      ctrlKey: true,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    }));
  });

  it('invoke callback once', () => {
    let a = 0, b = 0;
    driver.onKey((key: Key): boolean => {
      if (key.key == 'a') {
        ++a;
      } else {
        key.key == 'b'
        ++b;
      }
      return true;
    });

    let events = [
      new KeyboardEvent('keydown', { key: 'a' }),
      new KeyboardEvent('keydown', { key: 'b' }),
      new KeyboardEvent('keypress', { key: 'a' }),
      new KeyboardEvent('keyup', { key: 'a' }),
      new KeyboardEvent('keypress', { key: 'b' }),
      new KeyboardEvent('keyup', { key: 'b' }),
    ];
    for (let e of events) {
      target.dispatchEvent(e);
    }

    expect(a).to.equal(1);
    expect(b).to.equal(1);
  })

  it('propagates and stop handler chain', () => {
    let a = 0, b = 0, c = 0;
    driver.onKey((key: Key): boolean => {
      a++;
      return false;
    });
    driver.onKey((key: Key): boolean => {
      b++;
      return true;
    });
    driver.onKey((key: Key): boolean => {
      c++;
      return true;
    });

    target.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }));

    expect(a).to.equal(1);
    expect(b).to.equal(1);
    expect(c).to.equal(0);
  })

  it('does not invoke only meta keys', () => {
    driver.onKey((key: Key): boolean=> {
      expect.fail();
      return false;
    });

    target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift' }));
    target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Control' }));
    target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Alt' }));
    target.dispatchEvent(new KeyboardEvent('keydown', { key: 'OS' }));
  })

  it('ignores events from input elements', () => {
    ['input', 'textarea', 'select'].forEach((name) => {
      let input = window.document.createElement(name);
      let driver = new InputDriver(input);
      driver.onKey((key: Key): boolean => {
        expect.fail();
        return false;
      });
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'x' }));
    });
  });

  it('ignores events from contenteditable elements', () => {
    let div = window.document.createElement('div');
    let driver = new InputDriver(div);
    driver.onKey((key: Key): boolean => {
      expect.fail();
      return false;
    });

    div.setAttribute('contenteditable', '');
    div.dispatchEvent(new KeyboardEvent('keydown', { key: 'x' }));

    div.setAttribute('contenteditable', 'true');
    div.dispatchEvent(new KeyboardEvent('keydown', { key: 'x' }));
  });
});
