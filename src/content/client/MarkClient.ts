import Mark from '../domains/Mark';
import * as messages from '../../shared/messages';

export default interface MarkClient {
  setGloablMark(key: string, mark: Mark): Promise<void>;

  jumpGlobalMark(key: string): Promise<void>;
}

export class MarkClientImpl implements MarkClient {
  async setGloablMark(key: string, mark: Mark): Promise<void> {
    await browser.runtime.sendMessage({
      type: messages.MARK_SET_GLOBAL,
      key,
      x: mark.x,
      y: mark.y,
    });
  }

  async jumpGlobalMark(key: string): Promise<void> {
    await browser.runtime.sendMessage({
      type: messages.MARK_JUMP_GLOBAL,
      key,
    });
  }
}
