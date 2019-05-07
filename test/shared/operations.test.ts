import * as operations from 'shared/operations';

describe('operations', () => {
  describe('#valueOf', () => {
    it('returns an Operation', () => {
      let op: operations.Operation = operations.valueOf({
        type: operations.SCROLL_VERTICALLY,
        count: 10,
      });
      expect(op.type).to.equal(operations.SCROLL_VERTICALLY);
      expect(op.count).to.equal(10);
    });

    it('throws an Error on missing required parameter', () => {
      expect(() => operations.valueOf({
        type: operations.SCROLL_VERTICALLY,
      })).to.throw(TypeError);
    });

    it('fills default valus of optional parameter', () => {
      let op: operations.Operation = operations.valueOf({
        type: operations.COMMAND_SHOW_OPEN,
      });

      expect(op.type).to.equal(operations.COMMAND_SHOW_OPEN)
      expect(op.alter).to.be.false;
    });

    it('throws an Error on mismatch of parameter', () => {
      expect(() => operations.valueOf({
        type: operations.SCROLL_VERTICALLY,
        count: '10',
      })).to.throw(TypeError);

      expect(() => valueOf({
        type: operations.COMMAND_SHOW_OPEN,
        alter: 'true',
      })).to.throw(TypeError);
    });
  });
})
