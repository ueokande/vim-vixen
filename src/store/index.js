class Store {
  constructor(reducer, catcher) {
    this.reducer = reducer;
    this.catcher = catcher;
    this.state = this.reducer(undefined, {});
    this.subscribers = [];
  }

  dispatch(action) {
    if (action instanceof Promise) {
      action.then((a) => {
        this.transitNext(a);
      }).catch(this.catcher)
    } else {
      try {
        this.transitNext(action);
      } catch (e) {
        this.catcher(e);
      }
    }
  }

  getState() {
    return this.state;
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }

  transitNext(action) {
    let newState = this.reducer(this.state, action);
    if (JSON.stringify(this.state) !== JSON.stringify(newState)) {
      this.state = newState;
      this.subscribers.forEach(f => f.call())
    }
  }
}

const empty = () => {};

export function createStore(reducer, catcher = empty) {
  return new Store(reducer, catcher);
}
