import { expect } from "chai";
import actions from '../../src/actions';
import * as backgroundActions from '../../src/actions/background';

describe("background actions", () => {
  describe("requestCompletions", () => {
    it('create BACKGROUND_REQUEST_COMPLETIONS action', () => {
      let action = backgroundActions.requestCompletions('buffer hoge fuga');
      expect(action.type).to.equal(actions.BACKGROUND_REQUEST_COMPLETIONS);
      expect(action.command).to.equal('buffer');
      expect(action.keywords).to.equal('hoge fuga');
    });
  });
});
