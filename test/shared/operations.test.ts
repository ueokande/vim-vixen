import * as operations from "../../src/shared/operations";

describe("operations", () => {
  describe("#valueOf", () => {
    it("returns an Operation", () => {
      const op = operations.valueOf({
        type: operations.SCROLL_VERTICALLY,
        count: 10,
      }) as operations.ScrollVerticallyOperation;
      expect(op.type).toEqual(operations.SCROLL_VERTICALLY);
      expect(op.count).toEqual(10);
    });

    it("throws an Error on missing required parameter", () => {
      expect(() =>
        operations.valueOf({
          type: operations.SCROLL_VERTICALLY,
        })
      ).toThrow(TypeError);
    });

    it("fills default valus of optional parameter", () => {
      const op = operations.valueOf({
        type: operations.COMMAND_SHOW_OPEN,
      }) as operations.CommandShowOpenOperation;

      expect(op.type).toEqual(operations.COMMAND_SHOW_OPEN);
      expect(op.alter).toBeFalsy;
    });

    it("throws an Error on mismatch of parameter", () => {
      expect(() =>
        operations.valueOf({
          type: operations.SCROLL_VERTICALLY,
          count: "10",
        })
      ).toThrow(TypeError);

      expect(() =>
        operations.valueOf({
          type: operations.COMMAND_SHOW_OPEN,
          alter: "true",
        })
      ).toThrow(TypeError);
    });
  });
});
