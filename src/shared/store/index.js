class Store {
  constructor(reducer, catcher) {
    this.reducer = reducer;
    this.catcher = catcher;
    this.subscribers = [];
    try {
      this.state = this.reducer(undefined, {});
    } catch (e) {
      catcher(e);
    }
  }

  dispatch(action, sender) {
    if (action instanceof Promise) {
      action.then((a) => {
        this.transitNext(a, sender);
      }).catch((e) => {
        this.catcher(e, sender);
      });
    } else {
      try {
        this.transitNext(action, sender);
      } catch (e) {
        this.catcher(e, sender);
      }
    }
    return action;
  }

  getState() {
    return this.state;
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }

  transitNext(action, sender) {
    let newState = this.reducer(this.state, action);
    if (JSON.stringify(this.state) !== JSON.stringify(newState)) {
      this.state = newState;
      this.subscribers.forEach(f => f(sender));
    }
  }
}

const empty = () => {};

const createStore = (reducer, catcher = empty) => {
  return new Store(reducer, catcher);
};

export { createStore };
