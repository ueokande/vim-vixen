import { expect } from "chai";
import { createStore } from 'shared/store';

describe("Store class", () => {
  const reducer = (state, action) => {
    if (state == undefined) {
      return 0;
    }
    return state + action;
  };

  describe("#dispatch", () => {
    it('transit status by immediate action', () => {
      let store = createStore(reducer);
      store.dispatch(10);
      expect(store.getState()).to.equal(10);

      store.dispatch(-20);
      expect(store.getState()).to.equal(-10);
    });

    it('returns next state by immediate action', () => {
      let store = createStore(reducer);
      let dispatchedAction = store.dispatch(11);
      expect(dispatchedAction).to.equal(11);
    });

    it('transit status by Promise action', () => {
      let store = createStore(reducer);
      let p1 = Promise.resolve(10);

      return store.dispatch(p1).then(() => {
        expect(store.getState()).to.equal(10);
      }).then(() => {
        store.dispatch(Promise.resolve(-20));
      }).then(() => {
        expect(store.getState()).to.equal(-10);
      });
    });

    it('returns next state by promise action', () => {
      let store = createStore(reducer);
      let dispatchedAction = store.dispatch(Promise.resolve(11));
      return dispatchedAction.then((value) => {
        expect(value).to.equal(11);
      });
    });
  });

  describe("#subscribe", () => {
    it('invoke callback', (done) => {
      let store = createStore(reducer);
      store.subscribe(() => {
        expect(store.getState()).to.equal(15);
        done();
      });
      store.dispatch(15);
    });

    it('propagate sender object', (done) => {
      let store = createStore(reducer);
      store.subscribe((sender) => {
        expect(sender).to.equal('sender');
        done();
      });
      store.dispatch(15, 'sender');
    });
  })

  describe("catcher", () => {
    it('catch an error in reducer on initializing by immediate action', (done) => {
      let store = createStore(() => {
        throw new Error();
      }, (e) => {
        expect(e).to.be.an('error');
        done();
      });
    });

    it('catch an error in reducer on initializing by immediate action', (done) => {
      let store = createStore((state, action) => {
        if (state === undefined) return 0;
        throw new Error();
      }, (e) => {
        expect(e).to.be.an('error');
        done();
      });
      store.dispatch(20);
    });

    it('catch an error in reducer on initializing by promise action', (done) => {
      let store = createStore((state, action) => {
        if (state === undefined) return 0;
        throw new Error();
      }, (e) => {
        expect(e).to.be.an('error');
        done();
      });
      store.dispatch(Promise.resolve(20));
    });

    it('catch an error in promise action', (done) => {
      let store = createStore((state, action) => 0, (e) => {
        expect(e).to.be.an('error');
        done();
      });
      store.dispatch(new Promise(() => { throw new Error() }));
    });
  })
});

