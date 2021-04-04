import * as actions from "../../../src/console/actions";
import * as completionActions from "../../../src/console/actions/completion";
import { expect } from "chai";

import browserFake from "webextensions-api-fake";

describe("completion actions", () => {
  beforeEach(() => {
    (global as any).browser = browserFake();
  });

  describe("completionPrev", () => {
    it("create COMPLETION_COMPLETION_PREV action", () => {
      const action = completionActions.completionPrev();
      expect(action.type).to.equal(actions.COMPLETION_COMPLETION_PREV);
    });
  });

  describe("completionNext", () => {
    it("create COMPLETION_COMPLETION_NEXT action", () => {
      const action = completionActions.completionNext();
      expect(action.type).to.equal(actions.COMPLETION_COMPLETION_NEXT);
    });
  });
});
