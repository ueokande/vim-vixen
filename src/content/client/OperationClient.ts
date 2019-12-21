import * as operations from '../../shared/operations';
import * as messages from '../../shared/messages';

export default interface OperationClient {
  execBackgroundOp(count: number, op: operations.Operation): Promise<void>;

  internalOpenUrl(
    url: string, newTab?: boolean, background?: boolean,
  ): Promise<void>;
}

export class OperationClientImpl implements OperationClient {
  execBackgroundOp(count: number, op: operations.Operation): Promise<void> {
    return browser.runtime.sendMessage({
      type: messages.BACKGROUND_OPERATION,
      count,
      operation: op,
    });
  }

  internalOpenUrl(
    url: string, newTab?: boolean, background?: boolean,
  ): Promise<void> {
    return browser.runtime.sendMessage({
      type: messages.BACKGROUND_OPERATION,
      count: 1,
      operation: {
        type: operations.INTERNAL_OPEN_URL,
        url,
        newTab,
        background,
      },
    });
  }
}
