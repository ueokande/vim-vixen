import { expect } from "chai";
import actions from 'content/actions';
import addonReducer from 'content/reducers/addon';

describe("addon reducer", () => {
  it('return the initial state', () => {
    let state = addonReducer(undefined, {});
    expect(state).to.have.property('enabled', true);
  });

  it('return next state for ADDON_ENABLE', () => {
    let action = { type: actions.ADDON_ENABLE};
    let prev = { enabled: false };
    let state = addonReducer(prev, action);

    expect(state.enabled).is.equal(true);
  });

  it('return next state for ADDON_DISABLE', () => {
    let action = { type: actions.ADDON_DISABLE};
    let prev = { enabled: true };
    let state = addonReducer(prev, action);

    expect(state.enabled).is.equal(false);
  });

  it('return next state for ADDON_TOGGLE_ENABLED', () => {
    let action = { type: actions.ADDON_TOGGLE_ENABLED };
    let state = { enabled: false };

    state = addonReducer(state, action);
    expect(state.enabled).is.equal(true);

    state = addonReducer(state, action);
    expect(state.enabled).is.equal(false);
  });

});
