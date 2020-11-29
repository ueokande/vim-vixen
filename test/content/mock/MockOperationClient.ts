import OperationClient from "../../../src/content/client/OperationClient";
import * as operations from "../../../src/shared/operations";

export default class MockOperationClient implements OperationClient {
  execBackgroundOp(_repeat: number, _op: operations.Operation): Promise<void> {
    throw new Error("not implemented");
  }

  internalOpenUrl(
    _url: string,
    _newTab?: boolean,
    _background?: boolean
  ): Promise<void> {
    throw new Error("not implemented");
  }
}
