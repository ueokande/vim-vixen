import * as operations from "../../src/shared/operations";
import { expect } from "chai";

describe("operations", () => {
  describe("#valueOf", () => {
    it("returns an Operation", () => {
      const op = operations.valueOf({
        type: operations.SCROLL_VERTICALLY,
        count: 10,
      }) as operations.ScrollVerticallyOperation;
      expect(op.type).to.equal(operations.SCROLL_VERTICALLY);
      expect(op.count).to.equal(10);
    });

    it("throws an Error on missing required parameter", () => {
      expect(() =>
        operations.valueOf({
          type: operations.SCROLL_VERTICALLY,
        })
      ).to.throw(TypeError);
    });

    it("fills default valus of optional parameter", () => {
      const op = operations.valueOf({
        type: operations.COMMAND_SHOW_OPEN,
      }) as operations.CommandShowOpenOperation;

      expect(op.type).to.equal(operations.COMMAND_SHOW_OPEN);
      expect(op.alter).to.be.false;
    });

    it("throws an Error on mismatch of parameter", () => {
      expect(() =>
        operations.valueOf({
          type: operations.SCROLL_VERTICALLY,
          count: "10",
        })
      ).to.throw(TypeError);

      expect(() =>
        operations.valueOf({
          type: operations.COMMAND_SHOW_OPEN,
          alter: "true",
        })
      ).to.throw(TypeError);
    });
  });
});
