import * as actions from 'content/actions';
import addonReducer from 'content/reducers/addon';

describe("addon reducer", () => {
  it('return the initial state', () => {
    let state = addonReducer(undefined, {});
    expect(state).to.have.property('enabled', true);
  });

  it('return next state for ADDON_SET_ENABLED', () => {
    let action = { type: actions.ADDON_SET_ENABLED, enabled: true };
    let prev = { enabled: false };
    let state = addonReducer(prev, action);

    expect(state.enabled).is.equal(true);
  });
});
