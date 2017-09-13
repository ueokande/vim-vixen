class Store {
  constructor(reducer, catcher) {
    this.reducer = reducer;
    this.catcher = catcher;
    this.state = this.reducer(undefined, {});
  }

  dispatch(action) {
    if (action instanceof Promise) {
      action.then((a) => {
        this.state = this.reducer(this.state, a);
      }).catch(this.catcher)
    } else {
      try {
        this.state = this.reducer(this.state, action);
      } catch (e) {
        this.catcher(e);
      }
    }
  }
}

const empty = () => {};

export function createStore(reducer, catcher = empty) {
  return new Store(reducer, catcher);
}
