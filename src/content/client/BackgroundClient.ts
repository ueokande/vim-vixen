import { injectable } from 'tsyringe';
import * as operations from '../../shared/operations';
import * as messages from '../../shared/messages';

@injectable()
export default class BackgroundClient {
  execBackgroundOp(op: operations.Operation): Promise<void> {
    return browser.runtime.sendMessage({
      type: messages.BACKGROUND_OPERATION,
      operation: op,
    });
  }
}
